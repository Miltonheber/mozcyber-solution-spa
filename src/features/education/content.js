// Conteúdo educativo estático. Quando existir a API de `education`, este módulo é substituído por um service.

export const TOPICS = [
  {
    id: "burlas",
    title: "Burlas por mensagem e chamada",
    icon: "sms",
    intro:
      "A maioria das burlas segue um guião: prometem dinheiro, ameaçam bloquear a conta ou pedem ajuda urgente. O objectivo é sempre o mesmo, fazê-lo agir depressa.",
    redFlags: [
      "Prémios ou sorteios em que nunca participou",
      "Pedidos para devolver dinheiro “enviado por engano”",
      "Ameaças de bloqueio de conta ou de cartão",
      "Ligações encurtadas ou com nomes parecidos com os oficiais",
    ],
    tips: [
      "Pare e respire. Nenhuma entidade séria exige uma decisão em minutos.",
      "Desligue e ligue você para o número oficial da operadora ou do banco.",
      "Nunca instale aplicações nem abra ligações enviadas por desconhecidos.",
      "Antes de devolver dinheiro, confirme o saldo na sua própria aplicação ou no balcão.",
    ],
  },
  {
    id: "engenharia-social",
    title: "Engenharia social",
    icon: "psychology",
    intro:
      "Em vez de atacar o telemóvel, o burlão ataca a pessoa: finge ser alguém de confiança e usa emoções como medo, pressa ou simpatia para obter o que quer.",
    redFlags: [
      "Quem liga já sabe o seu nome e finge ser do banco, da operadora ou de um familiar",
      "Pressão para não desligar nem falar com mais ninguém",
      "Pedido de segredo (“não diga a ninguém”)",
      "Mudança de número de um familiar ou chefe a pedir dinheiro",
    ],
    tips: [
      "Confirme a identidade por outro canal: ligue ao familiar ou à empresa no número que já tem.",
      "Desconfie de quem cria urgência ou pede segredo.",
      "Partilhe com a família e os mais idosos como estas abordagens funcionam.",
      "Limite o que publica nas redes sociais: datas, contactos e rotinas ajudam os burlões.",
    ],
  },
  {
    id: "credenciais",
    title: "Proteger PIN, códigos e palavras-passe",
    icon: "key",
    intro:
      "O PIN do M-Pesa, os códigos de verificação por SMS e as palavras-passe são pessoais. Quem os tem, tem acesso ao seu dinheiro e às suas contas.",
    redFlags: [
      "Qualquer pedido do seu PIN ou de um código recebido por SMS",
      "Páginas que imitam o banco ou a operadora e pedem “confirmar” dados",
      "Pedidos para ler em voz alta o código que acabou de receber",
    ],
    tips: [
      "Nunca diga o PIN nem os códigos por SMS, a ninguém, nem a funcionários.",
      "Use uma palavra-passe diferente em cada conta e active a verificação em dois passos.",
      "Escreva o endereço do banco no navegador em vez de seguir ligações recebidas.",
      "Se suspeitar que expôs um dado, altere-o de imediato e avise a entidade.",
    ],
  },
  {
    id: "sim-swap",
    title: "Troca de SIM (SIM swap)",
    icon: "sim_card",
    intro:
      "Na troca de SIM fraudulenta, o burlão convence a operadora a passar o seu número para um cartão que ele controla. Passa a receber as suas chamadas e os códigos de verificação.",
    redFlags: [
      "O telemóvel perde rede de repente, sem motivo, durante horas",
      "Mensagens ou chamadas da operadora sobre uma troca de SIM que não pediu",
      "Recebe avisos de acesso às suas contas que não reconhece",
    ],
    tips: [
      "Sem rede inesperada? Contacte a operadora de imediato, a partir de outro telefone.",
      "Peça à operadora para reforçar a verificação antes de qualquer troca de SIM.",
      "Evite divulgar o seu número e dados pessoais em publicações abertas.",
      "Depois de um caso suspeito, altere palavras-passe e avise o banco.",
    ],
  },
];
