import type { BlogPost } from '../types';

const BLOG_POSTS: BlogPost[] = [
    {
        id: '1',
        title: 'Top 5 Laptops para Programar en 2026',
        excerpt: 'Descubre las mejores opciones para desarrolladores, desde MacBooks hasta potentes workstations con Linux.',
        content: `
            <p>Elegir una laptop para programar no es tarea fácil. Dependiendo de tu stack tecnológico (Web, Mobile, Data Science), tus necesidades pueden variar enormemente.</p>
            <h3>1. MacBook Pro M4</h3>
            <p>Sin duda la reina del desarrollo web y mobile. Su eficiencia energética y potencia bruta la hacen imbatible.</p>
            <h3>2. Dell XPS 15</h3>
            <p>La mejor pantalla Windows del mercado, ideal para quienes necesitan precisión de color y potencia.</p>
            <h3>3. ThinkPad X1 Carbon</h3>
            <p>El teclado legendario de ThinkPad sigue siendo el favorito de los que escriben código todo el día.</p>
            <p>En conclusión, invierte en una buena pantalla y al menos 32GB de RAM si planeas usar contenedores.</p>
        `,
        author: 'Adrian Tech',
        date: '2026-01-15',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: '2',
        title: 'Guía Definitiva de Audio High-End',
        excerpt: '¿Vale la pena invertir en audífonos de estudio? Analizamos las diferencias entre sonido comercial y fidelidad pura.',
        content: `
            <p>El mundo del audiofilia es un camino de ida. Una vez que escuchas música con la calidad que fue grabada, no hay vuelta atrás.</p>
            <h3>Audífonos Abiertos vs Cerrados</h3>
            <p>Los audífonos abiertos ofrecen una escena sonora más amplia (soundstage), ideal para música orquestal y jazz. Los cerrados te aíslan del mundo.</p>
            <h3>DACs y Amplificadores</h3>
            <p>No subestimes la importancia de una buena fuente de energía para tus drivers.</p>
        `,
        author: 'Sound Master',
        date: '2026-01-10',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: '3',
        title: 'El Futuro de los Procesadores ARM',
        excerpt: 'Cómo la arquitectura ARM está desplazando a x86 en servidores y computadoras personales.',
        content: `
            <p>Desde la llegada de Apple Silicon, la industria se ha movido agresivamente hacia ARM. Qualcomm y otros fabricantes están pisando fuerte en Windows.</p>
            <p>Esto significa mayor eficiencia, menor calor y baterías que duran todo el día sin sacrificar rendimiento.</p>
        `,
        author: 'Silicio News',
        date: '2025-12-28',
        image: 'https://images.unsplash.com/photo-1555617981-d5a4f3759dce?auto=format&fit=crop&q=80&w=1000'
    }
];

export const BlogService = {
    getAll: async (): Promise<BlogPost[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(BLOG_POSTS), 300);
        });
    },

    getById: async (id: string): Promise<BlogPost | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(BLOG_POSTS.find(post => post.id === id));
            }, 300);
        });
    }
};
