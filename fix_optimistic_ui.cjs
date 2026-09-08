const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix handleDeletePost
const oldDelete = `  const handleDeletePost = async (postId: string) => {
    if (!isAdmin) {
      showToast('Apenas administradores podem remover publicações.');
      return;
    }

    const updated = posts.filter((p) => p.id !== postId);
    setPosts(updated);

    try {
      await deleteFirebasePost(postId);
      showToast('Publicação removida com sucesso!');
    } catch (err) {
      console.error('Error deleting post from Firebase', err);
      showToast('Erro ao remover do servidor.');
    }
    if (selectedInstagramPost?.id === postId) {
      setSelectedInstagramPost(null);
    }
  };`;

const newDelete = `  const handleDeletePost = async (postId: string) => {
    if (!isAdmin) {
      showToast('Apenas administradores podem remover publicações.');
      return;
    }
    
    // Store previous state for rollback
    const previousPosts = [...posts];
    const updated = posts.filter((p) => p.id !== postId);
    setPosts(updated);

    try {
      await deleteFirebasePost(postId);
      showToast('Publicação removida com sucesso!');
      if (selectedInstagramPost?.id === postId) {
        setSelectedInstagramPost(null);
      }
    } catch (err: any) {
      console.error('Error deleting post from Firebase', err);
      // Revert optimistic update
      setPosts(previousPosts);
      if (err.message && err.message.includes('Quota limit exceeded')) {
          showToast('⚠️ Limite gratuito diário do banco de dados atingido! Tente amanhã.');
      } else {
          showToast('Erro ao remover do servidor. Alteração desfeita.');
      }
    }
  };`;

content = content.replace(oldDelete, newDelete);

// Fix handleAddPost catch block
const oldAddCatch = `        showToast('Upload concluído com sucesso!');
    } catch (err: any) {
        console.error('Error saving posts to Firebase', err);
        if (err.message && err.message.includes('Quota limit exceeded')) {
            showToast('⚠️ Limite gratuito diário do banco de dados (Firebase) atingido! Tente novamente amanhã.');
        } else {
            showToast('Erro ao salvar no servidor.');
        }
    }`;

const newAddCatch = `        showToast('Upload concluído com sucesso!');
    } catch (err: any) {
        console.error('Error saving posts to Firebase', err);
        // Revert optimistic update by removing the newly added posts
        setPosts(prev => prev.filter(p => !optimisticPosts.find(op => op.id === p.id)));
        if (err.message && err.message.includes('Quota limit exceeded')) {
            showToast('⚠️ Limite gratuito diário do banco de dados (Firebase) atingido! Tente novamente amanhã.');
        } else {
            showToast('Erro ao salvar no servidor. Upload cancelado.');
        }
    }`;
    
content = content.replace(oldAddCatch, newAddCatch);

fs.writeFileSync('src/App.tsx', content);
