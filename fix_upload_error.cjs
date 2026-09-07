const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldCatch = `    } catch (err) {
        console.error('Error saving posts to Firebase', err);
        showToast('Erro ao salvar no servidor.');
    }`;

const newCatch = `    } catch (err: any) {
        console.error('Error saving posts to Firebase', err);
        if (err.message && err.message.includes('Quota limit exceeded')) {
            showToast('⚠️ Limite gratuito diário do banco de dados (Firebase) atingido! Tente novamente amanhã.');
        } else {
            showToast('Erro ao salvar no servidor.');
        }
    }`;

content = content.replace(oldCatch, newCatch);

const oldChunkCatch = `                } catch(e) {
                   console.error("Failed to chunk file", e);
                }`;

const newChunkCatch = `                } catch(e: any) {
                   console.error("Failed to chunk file", e);
                   if (e.message && e.message.includes('Quota limit exceeded')) {
                       throw new Error('Quota limit exceeded');
                   }
                }`;
                
content = content.replace(oldChunkCatch, newChunkCatch);

fs.writeFileSync('src/App.tsx', content);
