import React, { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';
import { Container, Logo, Title, Input, Botao, BotaoText, CenterView, List } from './styles';
import Books from './Books';
import getRealm from './services/realm';

function App() {
    const [disableBtn, setDisableBtn] = useState(false);
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [books, setBooks] = useState([]);
    const [idEdit, setIdEdit] = useState(null);

    useEffect(() => {
        loadBooks = async () => {
            const realm = await getRealm();
            const data = realm.objects('Book');
            setBooks(data);
        }
        loadBooks();
    }, []);



    saveBook = async (data) => {
        const realm = await getRealm();

        const id = realm.objects('Book').sorted('id', true).length > 0
            ? realm.objects('Book').sorted('id', true)[0].id + 1 : 1;

        const dadosLivro = {
            id: id,
            nome: data.nome,
            preco: data.preco
        }

        realm.write(() => {
            realm.create('Book', dadosLivro)
        });

    }


    addBook = async () => {
        if (nome === '' || preco === '') {
            alert('Preencha todos os campos!');
            return;
        }
        try {

            const data = { nome: nome, preco: preco };
            await saveBook(data);

            setNome('');
            setPreco('');
            Keyboard.dismiss();

        } catch (error) {
            alert(error);
        }
    }

    function editarBook(data) {
        setNome(data.nome);
        setPreco(data.preco);
        setIdEdit(data.id);
        setDisableBtn(true);
    }

    aditBook = async () => {
        if (idEdit === null) {
            alert('Você não pode editar!');
            return;
        }
        const realm = await getRealm();

        const response = {
            id: idEdit,
            nome: nome,
            preco: preco
        };
        await realm.write(() => {
            realm.create('Book', response, 'modified')
        });

        const dadosAlterados = await realm.objects('Book').sorted('id', false);
        setBooks(dadosAlterados);
        setNome('');
        setPreco('');
        setIdEdit(null);
        Keyboard.dismiss();
        setDisableBtn(false);

    }

    excluirBook = async (data) => {
        const realm = await getRealm();
        const ID = data.id;
        //ABRIR CONEXAO
        realm.write(() => {
            if (realm.objects('Book').filtered('id =' + ID).length > 0) {      // VERIFICA SE ID EXISTE
                realm.delete(
                    realm.objects('Book').filtered('id =' + ID)
                )
            }
        })
        //BUSCA TODOS OS ITENS DENTRO DO BANCO ORDENANDO PELO ID E FALSO PARA ORDEM DECRESCENTE
        const livrosAtuais = await realm.objects('Book').sorted('id', false);
        setBooks(livrosAtuais);

    }


    return (
        <Container>
            <Logo>Próximos Livros</Logo>

            <Title>Nome</Title>
            <Input
                autoCapitalize="none"
                autoCorrect={false}
                value={nome}
                onChangeText={(text) => setNome(text)}
            />

            <Title>Preço</Title>
            <Input
                autoCapitalize="none"
                autoCorrect={false}
                value={preco}
                onChangeText={(text) => setPreco(text)}
            />

            <CenterView>
                <Botao
                    onPress={addBook}
                    disabled={disableBtn}
                    style={{ opacity: disableBtn ? 0.1 : 1 }}
                >
                    <BotaoText>Cadastrar</BotaoText>
                </Botao>
                <Botao onPress={aditBook}>
                    <BotaoText>Editar</BotaoText>
                </Botao>
            </CenterView>

            <List
                showsVerticalScrollIndicator={false}
                keyboardShoulPersistTaps="handled"
                data={books}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => (<Books data={item} editar={editarBook} excluir={excluirBook} />)}
            />
        </Container>

    );
}
export default App;