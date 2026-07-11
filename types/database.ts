export type Meta = {
  id: string;
  titulo: string;
  descricao?: string;
  concluida: boolean;
};

export type ItemCardapio = {
  refeicao: string;
  descricao: string;
};

export type Cardapio = Record<string, ItemCardapio[]>;

export type ItemSuplementacao = {
  nome: string;
  dose: string;
  horario: string;
  observacao?: string;
};

export type Ingrediente = {
  item: string;
  quantidade: string;
  unidade: string;
};

export type Patient = {
  id: string;
  nome: string;
  email: string;
  cpf_hash: string;
  cpf_ultimos_digitos: string;
  telefone: string | null;
  ativo: boolean;
  criado_em: string;
};

export type Recipe = {
  id: string;
  titulo: string;
  descricao: string | null;
  ingredientes: Ingrediente[];
  modo_preparo: string;
  imagem_url: string | null;
  tags: string[] | null;
  criado_em: string;
};

export type Protocol = {
  id: string;
  patient_id: string;
  fase_reino: string | null;
  metas: Meta[];
  video_url: string | null;
  cardapio: Cardapio;
  receita_ids: string[] | null;
  suplementacao: ItemSuplementacao[];
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
};

export type OtpCode = {
  id: string;
  patient_id: string;
  code_hash: string;
  expira_em: string;
  usado: boolean;
  criado_em: string;
};

export type AccessLog = {
  id: string;
  patient_id: string;
  ip: string | null;
  user_agent: string | null;
  criado_em: string;
};

export type Session = {
  id: string;
  patient_id: string;
  jti: string;
  ip: string | null;
  user_agent: string | null;
  criado_em: string;
  expira_em: string;
  revogada_em: string | null;
};

export type Database = {
  public: {
    Tables: {
      patients: {
        Row: Patient;
        Insert: Partial<Patient>;
        Update: Partial<Patient>;
        Relationships: [];
      };
      recipes: {
        Row: Recipe;
        Insert: Partial<Recipe>;
        Update: Partial<Recipe>;
        Relationships: [];
      };
      protocols: {
        Row: Protocol;
        Insert: Partial<Protocol>;
        Update: Partial<Protocol>;
        Relationships: [];
      };
      otp_codes: {
        Row: OtpCode;
        Insert: Partial<OtpCode>;
        Update: Partial<OtpCode>;
        Relationships: [];
      };
      access_logs: {
        Row: AccessLog;
        Insert: Partial<AccessLog>;
        Update: Partial<AccessLog>;
        Relationships: [];
      };
      sessions: {
        Row: Session;
        Insert: Partial<Session>;
        Update: Partial<Session>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
