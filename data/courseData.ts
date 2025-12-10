import { Module } from "@/types/course";

export const courseModules: Module[] = [
    {
        id: "module-1",
        title: "COMECE AQUI",
        description: "Conceitos iniciais e entendimento do jogo",
        lessons: [
            {
                id: "lesson-1-0",
                title: "ENTRE NO GRUPO",
                duration: "00:22",
                videoId: "69325459e6750e7a7231e154",
                description: "Acesso ao grupo de estudos e suporte.",
                requiredPlan: "prata",
                buttons: [
                    {
                        id: "btn-1-0",
                        label: "ENTRAR NO GRUPO EXCLUSIVO DO WHATSAPP",
                        url: "https://chat.whatsapp.com/FKXP18N8TuYIWa4ykktJgI",
                        variant: "primary"
                    }
                ]
            },
            {
                id: "lesson-1-1",
                title: "A VERDADE SOBRE O JOGO",
                duration: "03:12",
                videoId: "6932d26f3700e02351961443",
                description: "Introdução ao meu estilo de jogo.",
                requiredPlan: "prata",
            },
        ],
    },
    {
        id: "module-2",
        title: "DICAS DO CABRAL",
        description: "Jogadas práticas",
        lessons: [
            {
                id: "lesson-2-1",
                title: "TUDO SOBRE A ROLETA",
                duration: "21:16",
                videoId: "69325ad52c6468ef6505dee5",
                description: "Entendendo a mecânica da roleta.",
                requiredPlan: "prata",
                buttons: [
                    {
                        id: "btn-2-1",
                        label: "SITE QUE EU MOSTRO NO VIDEO",
                        url: "https://go.1pra1.bet.br/KAriXZ",
                    }
                ]
            },
            {
                id: "lesson-2-2",
                title: "MEU GERENCIAMENTO",
                duration: "02:27",
                videoId: "6932d189f2e796b3c9e12ead",
                description: "Aprendendo a gerenciar suas fichas de forma justa.",
                requiredPlan: "prata",
            },
        ],
    },
    {
        id: "module-4",
        title: "SEQUÊNCIA DE JOGADAS",
        description: "Canais de ajuda e ofertas",
        lessons: [
            {
                id: "lesson-4-1",
                title: "ZERO ZERO",
                duration: "03:47",
                videoId: "69325bc1f2e796b3c9e0d7af",
                description: "Jogada Zero Zero.",
                requiredPlan: "prata",
                buttons: [
                    {
                        id: "btn-4-1",
                        label: "SITE QUE EU MOSTRO NO VIDEO",
                        url: "https://go.1pra1.bet.br/KAriXZ",
                    }
                ]
            },
            {
                id: "lesson-4-2",
                title: "RED ZONE",
                duration: "03:47",
                videoId: "69332b2544e4e1560f6d8767",
                description: "Jogada Red Zone.",
                requiredPlan: "prata",
                releaseDate: "2025-12-05T20:00:00",
                // buttons: [
                //     {
                //         id: "btn-4-2",
                //         label: "SITE QUE EU MOSTRO NO VIDEO",
                //         url: "https://go.1pra1.bet.br/KAriXZ",
                //     }
                // ]
            },
            {
                id: "lesson-4-3",
                title: "BLACK CAT",
                duration: "04:05",
                videoId: "69332c3577723b2a72ccce4f",
                description: "Jogada Black Cat.",
                requiredPlan: "ouro",
                // buttons: [
                //     {
                //         id: "btn-1-0",
                //         label: "SITE QUE EU MOSTRO NO VIDEO",
                //         url: "https://go.1pra1.bet.br/KAriXZ",
                //     }
                // ]
            },
            {
                id: "lesson-4-5",
                title: "ICE BALL",
                duration: "03:25",
                videoId: "69326badafcc411b3a7203e3",
                description: "Jogada Ice Ball.",
                requiredPlan: "diamante",
                buttons: [
                    {
                        id: "btn-4-5",
                        label: "SITE QUE EU MOSTRO NO VIDEO",
                        url: "https://go.1pra1.bet.br/KAriXZ",
                    }
                ]
            },
            {
                id: "lesson-4-6",
                title: "VEGAS",
                duration: "00:00",
                videoId: "69325bc1f2e796b3c9e0d7af",
                description: "Jogada Vegas.",
                requiredPlan: "diamante",
                releaseDate: "2025-12-15T00:00:00",
            }
        ],
    },
    {
        id: "module-5",
        title: "Suporte",
        description: "Canais de ajuda e ofertas",
        lessons: [
            {
                id: "lesson-5-1",
                title: "SUPORTE",
                duration: "00:25",
                videoId: "6932547d4d2612824eaca523",
                description: "Como obter ajuda.",
                requiredPlan: "prata",
                content: "Precisa de ajuda? Entre em contato com nosso suporte.",
                email: "suporte@allacabral.com.br",
                buttons: [
                    {
                        id: "btn-5-1",
                        label: "SUPORTE VIA INSTAGRAM",
                        url: "https://instagram.com/suportedocabral/",
                        variant: "instagram"
                    }
                ]
            },
        ],
    },
];
