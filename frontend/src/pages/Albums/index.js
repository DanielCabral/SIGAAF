import React,{useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import Footer from '../../components/Footer';
import Menu from '../../components/Menu';
import {FiSearch,FiX} from "react-icons/fi/";

//Material UI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {IconButton,Icon,} from '@material-ui/core/';
import Delete from '@material-ui/icons/Delete'; 
import Edit from '@material-ui/icons/Edit'; 

import api from '../../services/api';
import './styles.css';

import logoImg from '../../assets/imageAlbum.svg';

export default function Albums(){
    const [albums,setAlbums]=useState([]);
    const [albumsList,setAlbumsList]=useState([]);
    const [idAlbumSelected,setIdAlbumSelected]=useState(0);
    const [tituloAlbumEdit,setTituloAlbumEdit]=useState('');
    const [descricaoAlbumEdit,setDescricaoAlbumEdit]=useState('');
    const [dataAquisicaoAlbumEdit,setDataAquisicaoAlbumEdit]=useState('2014-08-12');
    const [estadoConservacaoAlbumEdit,setEstadoConservacaoAlbumEdit]=useState('');
    const [tituloField,setTituloField]=useState('');
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    useEffect(()=>{
        api.get('albums')
        .then(response=>{
            setAlbums(response.data);
            setAlbumsList(response.data)
        });
    },[]);

    function abrirConfirmacaoDelete(id){
        setIdAlbumSelected(id);
        setOpen(true);
    }
    function deleteAlbum(){
        api.delete(('album/'+idAlbumSelected))
        .then(response=>{
            setAlbums(albums.filter((album) => (album.id!=idAlbumSelected?true:false)));
            setAlbumsList(albumsList.filter((album) => (album.id!=idAlbumSelected?true:false)));
        })
        .catch((err) => {
            console.log(err);
            alert('Erro na deleção');
        });
       
        handleCloseDelete();
    }

    function handleCloseDelete(){
        setOpen(false);
    }

    function abrirModalEdit(id){
        setIdAlbumSelected(id);
        setTituloAlbumEdit(albumsList.find(x => x.id === id).album_titulo);
        setDescricaoAlbumEdit(albumsList.find(x => x.id === id).album_descricao);
        setDataAquisicaoAlbumEdit(albumsList.find(x => x.id === id).album_data_aquisicao);
        setEstadoConservacaoAlbumEdit(albumsList.find(x => x.id === id).album_estado_conservacao);
        setOpenEdit(true);
    }
    async function editAlbum(){
       const albumEdit={
            album_titulo: tituloAlbumEdit,
            album_descricao: descricaoAlbumEdit,
            album_data_aquisicao: dataAquisicaoAlbumEdit,
            album_estado_conservacao: estadoConservacaoAlbumEdit,
            id: idAlbumSelected
       };
        try{    
            const response=await api.put(('album/'+idAlbumSelected),albumEdit);
            const albumIndex= albums.findIndex(x => x.id === idAlbumSelected);
            albums[albumIndex]=albumEdit;
            const albumListIndex= albumsList.findIndex(x => x.id === idAlbumSelected);
            albumsList[albumListIndex]=albumEdit;
        }catch(err){
            alert('Falha na edição, tente novamente');
        }
        handleCloseEdit();
    }

    function handleCloseEdit(){
        setOpenEdit(false);
    }
    


    function filtrarAlbums(){
        //name field?
        setAlbumsList(albums.filter((album)=> album.album_titulo.startsWith(tituloField)));
    }
    function limparCampo(){
        setAlbumsList([...albums]);
        //aqui tb
        setTituloField('');
    }

    return(
        <div>
            <div className="container">
                <div className="menulateral">
                    <Menu></Menu>
                </div>
                <div className="header"> 
                </div>
                <div className="title">
                    <h2>Listar Albuns</h2>
                </div>
                <div className="search">
                    <input 
                        type='text' 
                        className="search-text"
                        id="input-search"
                        value={tituloField} 
                        placeholder="Informe o nome do album"
                        onChange={e => setTituloField(e.target.value)}
                    />
                    <button className='button button-search' onClick={filtrarAlbums}>
                        <FiSearch size="14"></FiSearch>
                        Pesquisar
                    </button>
                    <button className='button-cancel button-clear' onClick={limparCampo}>
                        <FiX size="14"></FiX>
                        Limpar
                    </button>        
                </div>
                <div>
                    <div className="dash-content">         
                        <table className='dash'>
                            <thead>
                                <tr className='column-heading'>
                                    <th className='collumn-titulo'>Imagem</th>
                                    <th className='collumn-titulo'>Titulo</th>
                                    <th className='collum-descricao'>Descricao</th>
                                    <th className='collumn-aquisicao'>Data de aquisição</th>
                                    <th className='collumn-conservacao'>Estado de Conservação</th>
                                    <th className='collumn-actions'>Opções</th>
                                </tr>
                            </thead>
                            <tbody className='collumn-body'>
                                {albumsList.map(album => (
                                    <tr key={album.id}>
                                        <td><img src={logoImg} alt=""/></td>
                                        <td>{album.album_titulo}</td>
                                        <td>{album.album_descricao}</td>
                                        <td>{album.album_data_aquisicao}</td>
                                        <td>{album.album_estado_conservacao}</td>
                                        <td className="action">
                                            <IconButton aria-label="edit"  onClick={() =>abrirModalEdit(album.id)}>
                                                <Icon style={{ color: "black" }}>
                                                    <Edit />
                                                </Icon>
                                            </IconButton>
                                            <IconButton aria-label="delete" onClick={() => abrirConfirmacaoDelete(album.id)}>
                                                <Icon  style={{ color: "#e02041" }}>
                                                    <Delete />
                                                </Icon>
                                            </IconButton>     
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Dialog
                                open={open}
                                onClose={handleCloseDelete}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Confirmação"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                Tem certeza que deseja deletar o album?
                                </DialogContentText>
                                </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDelete} color="primary" autoFocus>
                                    Não
                                </Button>
                                <Button onClick={deleteAlbum} color="default" autoFocus>
                                    Sim
                                </Button>
                                </DialogActions>
                        </Dialog>
                        <Dialog open={openEdit} onClose={handleCloseEdit} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Editar Album</DialogTitle>
                                <DialogContent>
                                <DialogContentText>

                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="titulo"
                                    label="Titulo"
                                    type="text"
                                    fullWidth
                                    value={tituloAlbumEdit} 
                                    onChange={e => setTituloAlbumEdit(e.target.value)}
                                />
                                <TextField
                                    margin="dense"
                                    id="descricao"
                                    label="Descrição"
                                    type="text"
                                    fullWidth
                                    value={descricaoAlbumEdit} 
                                    onChange={e => setDescricaoAlbumEdit(e.target.value)}
                                />
                                <TextField
                                    id="data_aquisicao"
                                    label={"Data de Aquisição"}
                                    type="date"
                                    defaultValue={dataAquisicaoAlbumEdit}
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                    onChange={e => setDataAquisicaoAlbumEdit(e.target.value)}
                                />
                                <TextField
                                    margin="dense"
                                    id="estado_conservacao"
                                    label="Estado de Conservação"
                                    type="text"
                                    fullWidth
                                    value={estadoConservacaoAlbumEdit} 
                                    onChange={e => setEstadoConservacaoAlbumEdit(e.target.value)}
                                />
                                </DialogContent>
                                <DialogActions>
                                <Button onClick={handleCloseEdit} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={editAlbum} color="primary">
                                    Editar
                                </Button>
                                </DialogActions>
                            </Dialog>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}