import api from './api';

class App {
    constructor() {
        this.repositorios = []; //JSON.parse(localStorage.getItem('repositorios') || []);

        this.formulario = document.querySelector('form');

        this.lista = document.querySelector('.list-group');

        this.registrarEventos();
    }

    registrarEventos() {
        
        let btn = document.querySelector('button[id=botao]');
        
        btn.onclick = () => {

            let input = this.formulario.querySelector('input[id=repositorio]').value;
            
            if(input !== ''){
                this.removeSpans();
 
                this.formulario.onsubmit = (evento) => this.adicionarRepositorio(evento);
            } else {
                this.removeSpans();
                
                let span = document.createElement('span');
                span.setAttribute('class', 'alert alert-danger');
                span.setAttribute('id', 'alert');
                
                let msg = document.createTextNode('Insira algum repositório');
                
                span.appendChild(msg);
                
                this.lista.appendChild(span);
                console.log(this.lista)
            }
        }
        
    }
    
    async adicionarRepositorio(evento) {
        // Evita que o formulario recarregue a página
        evento.preventDefault();
        
        //Recuperar o valor do input
        let input = this.formulario.querySelector('input[id=repositorio]').value;
        
        this.searchRepository();
        
        try {
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

            this.lista.removeChild(document.querySelector('.alert-warning'));

            this.salveDataToStorage(); 

            this.addRepository(dateRepository);
            

        } catch(error) {
            this.lista.removeChild(document.querySelector('.alert-warning'));

            let er = this.lista.querySelector('alert alert-danger');
            if(er !== null){
                this.lista.removeChild(er);
            }

            let span = document.createElement('span');
            span.setAttribute('class', 'alert alert-danger');
            span.setAttribute('id', 'alert');

            let msg = document.createTextNode('O repositório não foi encontrado');

            span.appendChild(msg);

            this.lista.appendChild(span);
        }
    }

    searchRepository() {

        this.removeSpans();

        let span = document.createElement('span');
        span.setAttribute('class', 'alert alert-warning');
        span.setAttribute('id', 'alert');

        let msg = document.createTextNode('Aguarde, estamos buscando');

        span.appendChild(msg);

        this.lista.appendChild(span);

    }

    addRepository(repositorio) {

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
    
}

    removeSpans() {
        let spans = document.querySelectorAll('span[id=alert]');

        for(let i=0; i < spans.length; i++) {
            this.lista.removeChild(spans[i]);
        }
    }

    deleteRepository(repository) {
        repository.remove();
    }

    salveDataToStorage() {
        localStorage.setItem('repositorios', JSON.stringify(this.repositorios));
    }

}

new App();