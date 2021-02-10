import api from './api';

class App {
    constructor() {
        this.repositorios = []; //JSON.parse(localStorage.getItem('repositorios') || []);

        this.formulario = document.querySelector('form');

        this.lista = document.querySelector('.list-group');

        this.registrarEventos();
    }

    registrarEventos() {
       this.formulario.onsubmit = evento => this.adicionarRepositorio(evento); 
    }

    async adicionarRepositorio(evento) {
        // Evita que o formulario recarregue a página
        evento.preventDefault();

        //Recuperar o valor do input
        let input = this.formulario.querySelector('input[id=repositorio]').value;

        //Se o input vier vazio... sai da app
        if(input.length === 0) {
            return; //sempre sai da aplicação
        }

        let response = await api.get(`/repos/${input}`);

        let {name, description, html_url, owner: { avatar_url } } = response.data;

        let dateRepository = {
            nome: name,
            descricao: description,
            avatar_url,
            link: html_url,
        }

        //Adiciona o repositorio na lista
        this.repositorios.push({
            dateRepository,
        });

        this.salveDataToStorage(); 

        this.addRepository(dateRepository);

    }

    addRepository(repositorio) {
        //Limpar o conteudo de lista
        //this.lista.innerHTML = '';
        
        // Percorrer toda a lista de repositorios e cria os elementos
        //this.repositorios.forEach(repositorio =>{
            
            //<li>
            let li = document.createElement('li');
            li.setAttribute('class', 'list-group-item list-group-item-action');
            
            let img = document.createElement('img');
            img.setAttribute('src', repositorio.avatar_url);
            li.appendChild(img);
            
            let strong = document.createElement('strong');
            let txtNome = document.createTextNode(repositorio.nome);
            strong.appendChild(txtNome);
            li.appendChild(strong);
            
            let p = document.createElement('p');
            let txtDescricao = document.createTextNode(repositorio.descricao);
            p.appendChild(txtDescricao);
            li.appendChild(p);
            
            let a = document.createElement('a');
            a.setAttribute('target', 'blank');
            a.setAttribute('href', repositorio.link);
            let txtA = document.createTextNode('Acessar');
            a.appendChild(txtA);
            li.appendChild(a);
           
            li.onclick = () => {
                this.deleteRepository(li);    
            }

            this.lista.appendChild(li);
    
            let inputRepositorio = this.formulario.querySelector('input[id=repositorio]');

            inputRepositorio.value = '';

            //Adiciona o foco no input
            inputRepositorio.focus();
        //});
        
    }

    deleteRepository(repository) {
        //this.repositorios.splice(this.repositorios.indexOf(repository.textContent),1);
        //console.log(this.repositorios.indexOf(repository.textContent));
        repository.remove();

    }

    salveDataToStorage() {
        localStorage.setItem('repositorios', JSON.stringify(this.repositorios));
    }

}

new App();