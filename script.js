/**
 * SCRIPT COMPLETO - DUTY CAFFE
 * Funcionalidades: Menu Mobile, Carrossel Interativo, Smooth Scroll, Animações
 */

document.addEventListener('DOMContentLoaded', function () {
    inicializarMenuMobile();
    inicializarCarrosseis();
    inicializarAnimacoes();
    inicializarFormularios();
    inicializarEfeitosScroll();
});

/* ============================================
   MENU MOBILE
   ============================================ */
function inicializarMenuMobile() {
    const botaoMenuMobile = document.getElementById('botaoMenuMobile');
    const navegacao = document.getElementById('navegacao');

    if (!botaoMenuMobile || !navegacao) return;

    // Toggle do menu ao clicar no botão
    botaoMenuMobile.addEventListener('click', function () {
        botaoMenuMobile.classList.toggle('ativo');
        navegacao.classList.toggle('ativa');
    });

    // Fecha o menu ao clicar em um link
    const links = navegacao.querySelectorAll('.cabecalho-link');
    links.forEach(link => {
        link.addEventListener('click', function () {
            botaoMenuMobile.classList.remove('ativo');
            navegacao.classList.remove('ativa');
        });
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', function (evento) {
        const clicouNoMenu = navegacao.contains(evento.target);
        const clicouNoBotao = botaoMenuMobile.contains(evento.target);

        if (!clicouNoMenu && !clicouNoBotao && navegacao.classList.contains('ativa')) {
            botaoMenuMobile.classList.remove('ativo');
            navegacao.classList.remove('ativa');
        }
    });

    // Fecha o menu ao pressionar ESC
    document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape' && navegacao.classList.contains('ativa')) {
            botaoMenuMobile.classList.remove('ativo');
            navegacao.classList.remove('ativa');
        }
    });
}

/* ============================================
   CARROSSEL INTERATIVO
   ============================================ */
function inicializarCarrosseis() {
    const containers = document.querySelectorAll('.carrossel-container');

    containers.forEach(container => {
        const botoesEsquerda = container.querySelector('.botao-carrossel-esquerda');
        const botoesDireita = container.querySelector('.botao-carrossel-direita');
        const carrosselConteudo = container.querySelector('.carrossel-conteudo');

        if (botoesEsquerda && botoesDireita && carrosselConteudo) {
            // Eventos dos botões
            botoesEsquerda.addEventListener('click', () => {
                rolarCarrossel(carrosselConteudo, 'esquerda');
            });

            botoesDireita.addEventListener('click', () => {
                rolarCarrossel(carrosselConteudo, 'direita');
            });

            // Suporte para teclado
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    rolarCarrossel(carrosselConteudo, 'esquerda');
                } else if (e.key === 'ArrowRight') {
                    rolarCarrossel(carrosselConteudo, 'direita');
                }
            });

            // Suporte para swipe/toque
            adicionarSuporteSwipe(carrosselConteudo);

            // Suporte para scroll com mouse wheel
            adicionarSuporteMouseWheel(carrosselConteudo);
        }
    });
}

/**
 * Função para rolar o carrossel
 */
function rolarCarrossel(carrossel, direcao) {
    const primeiroItem = carrossel.querySelector(':first-child');
    if (!primeiroItem) return;

    const larguraItem = primeiroItem.offsetWidth;
    const gap = parseInt(window.getComputedStyle(carrossel).gap) || 0;
    const distancia = larguraItem + gap;

    const posicaoAtual = carrossel.scrollLeft;
    let novaPosicao;

    if (direcao === 'esquerda') {
        novaPosicao = posicaoAtual - distancia;
    } else if (direcao === 'direita') {
        novaPosicao = posicaoAtual + distancia;
    }

    // Garante que não ultrapasse os limites
    const maxScroll = carrossel.scrollWidth - carrossel.clientWidth;
    novaPosicao = Math.max(0, Math.min(novaPosicao, maxScroll));

    carrossel.scrollTo({
        left: novaPosicao,
        behavior: 'smooth'
    });
}

/**
 * Suporte para swipe em dispositivos móveis
 */
function adicionarSuporteSwipe(carrossel) {
    let posicaoInicial = 0;
    let posicaoAtual = 0;
    let emSwipe = false;

    carrossel.addEventListener('touchstart', (e) => {
        posicaoInicial = e.touches[0].clientX;
        emSwipe = true;
    }, false);

    carrossel.addEventListener('touchmove', (e) => {
        if (!emSwipe) return;
        posicaoAtual = e.touches[0].clientX;
    }, false);

    carrossel.addEventListener('touchend', () => {
        if (!emSwipe) return;
        emSwipe = false;

        const diferenca = posicaoInicial - posicaoAtual;

        // Swipe significativo (mais de 50px)
        if (Math.abs(diferenca) > 50) {
            if (diferenca > 0) {
                rolarCarrossel(carrossel, 'direita');
            } else {
                rolarCarrossel(carrossel, 'esquerda');
            }
        }
    }, false);
}

/**
 * Suporte para scroll com mouse wheel
 */
function adicionarSuporteMouseWheel(carrossel) {
    carrossel.addEventListener('wheel', (e) => {
        e.preventDefault();

        if (e.deltaY > 0) {
            rolarCarrossel(carrossel, 'direita');
        } else {
            rolarCarrossel(carrossel, 'esquerda');
        }
    }, { passive: false });
}

/* ============================================
   ANIMAÇÕES AO ENTRAR NA VIEWPORT
   ============================================ */
function inicializarAnimacoes() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observa elementos para animar
    const elementos = document.querySelectorAll(
        '.sabor-card, .depoimento-card, .info-bloco, .item-cardapio'
    );

    elementos.forEach(elemento => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(20px)';
        elemento.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(elemento);
    });
}

/* ============================================
   FORMULÁRIOS
   ============================================ */
function inicializarFormularios() {
    const formularioNewsletter = document.querySelector('.newsletter-form');

    if (formularioNewsletter) {
        formularioNewsletter.addEventListener('submit', function (e) {
            e.preventDefault();

            const input = this.querySelector('.newsletter-input');
            const email = input.value.trim();

            if (validarEmail(email)) {
                // Feedback visual
                const botao = this.querySelector('.newsletter-botao');
                const textoOriginal = botao.textContent;

                botao.textContent = 'Inscrito! ✓';
                botao.style.backgroundColor = '#7cb342';

                input.value = '';

                setTimeout(() => {
                    botao.textContent = textoOriginal;
                    botao.style.backgroundColor = '';
                }, 3000);

                console.log('Email inscrito:', email);
            } else {
                alert('Por favor, insira um email válido.');
            }
        });
    }
}

/**
 * Validar email
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/* ============================================
   EFEITOS DE SCROLL
   ============================================ */
function inicializarEfeitosScroll() {
    let ultimoScroll = 0;
    const cabecalho = document.querySelector('.cabecalho');

    window.addEventListener('scroll', function () {
        const scrollAtual = window.scrollY;

        // Efeito de sombra no cabeçalho
        if (scrollAtual > 50) {
            cabecalho.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
        } else {
            cabecalho.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }

        ultimoScroll = scrollAtual;
    });
}

/* ============================================
   SMOOTH SCROLL PARA ÂNCORAS
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Ignora links vazios
        if (href === '#' || href === '#contato') {
            return;
        }

        e.preventDefault();

        const alvo = document.querySelector(href);
        if (alvo) {
            const offsetTop = alvo.offsetTop - 80; // Compensa altura do cabeçalho sticky

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

/* ============================================
   DETECÇÃO DE DEVICE
   ============================================ */
function ehMobile() {
    return window.innerWidth <= 768;
}

function ehTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

/* ============================================
   OTIMIZAÇÃO DE PERFORMANCE
   ============================================ */
// Lazy loading para imagens (se suportado)
if ('IntersectionObserver' in window) {
    const imagensLazy = document.querySelectorAll('img[data-src]');

    const observadorImagens = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    imagensLazy.forEach(img => observadorImagens.observe(img));
}

/* ============================================
   LOGS E DEBUG
   ============================================ */
console.log('✓ Script Duty Caffe carregado com sucesso!');
console.log('✓ Menu Mobile: Ativo');
console.log('✓ Carrossel: Ativo');
console.log('✓ Animações: Ativas');
console.log('✓ Responsividade: Otimizada');

// Função para debug (remover em produção)
window.debugDutyCaffe = {
    ehMobile: ehMobile(),
    ehTablet: ehTablet(),
    larguraTela: window.innerWidth,
    alturaTela: window.innerHeight,
    versao: '1.0.0'
};
