import React from "react";
import { z } from "zod";
import { AutoForm, SimpleForm } from "@/components/auto-form";
import { AutoFormConfig } from "@/types/auto-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Schema para formulário com steps
const stepFormSchema = z.object({
  // Informações pessoais
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  age: z.number().min(18, "Idade mínima é 18 anos").max(120, "Idade máxima é 120 anos"),
  birth_date: z.date(),
  
  // Preferências
  notifications: z.boolean(),
  notifications_others: z.string().optional(),
  
  // Tipo de usuário
  user_type: z.enum(["individual", "company", "outros"]),
  user_type_others: z.string().optional(),
  
  // Campos condicionais
  company_name: z.string().optional(),
  company_size: z.enum(["small", "medium", "large"]).optional(),
  
  // Interesses (condicional) - agora como array
  interests: z.array(z.string()).optional(),
  teste_v: z.string(),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres").optional(),
});

// Schema para formulário simples
const simpleFormSchema = z.object({
  full_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  age: z.number().min(18, "Idade mínima é 18 anos"),
  skills: z.array(z.string()).min(1, "Selecione pelo menos uma habilidade"),
  experience_level: z.enum(["junior", "pleno", "senior"]),
  available_for_remote: z.boolean(),
  bio: z.string().optional(),
});

const Index = () => {
  // Configuração do formulário com steps
  const stepFormConfig: AutoFormConfig = {
    title: "Formulário de Cadastro Dinâmico (Multi-Step)",
    description: "Exemplo completo de auto-form com múltiplas etapas e lógica condicional",
    schema: stepFormSchema,
    showProgress: true,
    submitButtonText: "Finalizar Cadastro",
    
    fields: {
      name: {
        label: "Nome Completo",
        placeholder: "Digite seu nome completo",
        type: "text",
        required: true,
      },
      email: {
        label: "Email",
        placeholder: "seu@email.com",
        type: "email",
        required: true,
      },
      age: {
        label: "Idade",
        placeholder: "Sua idade",
        type: "number",
        required: true,
      },
      birth_date: {
        label: "Data de Nascimento",
        placeholder: "Selecione sua data de nascimento",
        type: "date",
        required: true,
      },
      notifications: {
        label: "Desejo receber notificações por email",
        type: "checkbox",
        required: false,
      },
      user_type: {
        label: "Tipo de Usuário",
        type: "select",
        required: true,
        options: [
          { label: "Pessoa Física", value: "individual" },
          { label: "Empresa", value: "company" },
          { label: "Outros", value: "outros" },
        ],
      },
      company_name: {
        label: "Nome da Empresa",
        placeholder: "Digite o nome da empresa",
        type: "text",
        required: true,
        dependsOn: {
          field: "user_type",
          value: "company",
          condition: "equals",
        },
      },
      company_size: {
        label: "Tamanho da Empresa",
        type: "select",
        required: true,
        options: [
          { label: "Pequena (1-10 funcionários)", value: "small" },
          { label: "Média (11-100 funcionários)", value: "medium" },
          { label: "Grande (100+ funcionários)", value: "large" },
        ],
        dependsOn: {
          field: "user_type",
          value: "company",
          condition: "equals",
        },
      },
      interests: {
        label: "Áreas de Interesse",
        type: "select",
        multiple: true,
        options: [
          { label: "Tecnologia", value: "tech" },
          { label: "Marketing", value: "marketing" },
          { label: "Vendas", value: "sales" },
          { label: "Finanças", value: "finance" },
        ],
        dependsOn: {
          field: "user_type",
          value: "outros",
          condition: "not_equals",
        },
      },
      bio: {
        label: "Biografia",
        placeholder: "Conte um pouco sobre você...",
        type: "textarea",
        description: "Máximo de 500 caracteres",
        dependsOn: {
          field: "user_type",
          value: "individual",
          condition: "equals",
        },
      },
      teste_v: {
          label: "Teste de Campo Condicional",
          placeholder: "Especifique outras notificações",
          type: "radio",
          required: true,
          options: [
              { label: "SMS", value: "sms" },
              { label: "Push", value: "push" },
              { label: "Nenhuma", value: "none" },
          ]
      },
    },
    
    steps: [
      {
        title: "Informações Pessoais",
        description: "Dados básicos do usuário",
        fields: ["teste_v", "name", "email", "age", "birth_date"],
      },
      {
        title: "Tipo de Usuário",
        description: "Defina o tipo de conta",
        fields: ["user_type", "company_name", "company_size"],
      },
      {
        title: "Preferências",
        description: "Configure suas preferências",
        fields: ["notifications", "interests", "bio"],
      },
    ],
    
    onSubmit: async (data) => {
      console.log("Dados do formulário multi-step:", data);
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Formulário multi-step enviado com sucesso! Verifique o console para ver os dados.");
    },
  };

  // Configuração do formulário simples
  const simpleFormConfig = {
    title: "Formulário Simples de Perfil",
    description: "Exemplo de formulário único sem etapas",
    schema: simpleFormSchema,
    submitButtonText: "Criar Perfil",
    
    fields: {
      full_name: {
        label: "Nome Completo",
        placeholder: "Digite seu nome completo",
        type: "text" as const,
        required: true,
      },
      email: {
        label: "Email",
        placeholder: "seu@email.com",
        type: "email" as const,
        required: true,
      },
      age: {
        label: "Idade",
        placeholder: "Sua idade",
        type: "number" as const,
        required: true,
      },
      skills: {
        label: "Habilidades Técnicas",
        type: "select" as const,
        multiple: true,
        required: true,
        options: [
          { label: "JavaScript", value: "javascript" },
          { label: "TypeScript", value: "typescript" },
          { label: "React", value: "react" },
          { label: "Node.js", value: "nodejs" },
          { label: "Python", value: "python" },
          { label: "Java", value: "java" },
        ],
      },
      experience_level: {
        label: "Nível de Experiência",
        type: "select" as const,
        required: true,
        options: [
          { label: "Júnior", value: "junior" },
          { label: "Pleno", value: "pleno" },
          { label: "Sênior", value: "senior" },
        ],
      },
      available_for_remote: {
        label: "Disponível para trabalho remoto",
        type: "checkbox" as const,
        required: false,
      },
      bio: {
        label: "Biografia Profissional",
        placeholder: "Conte um pouco sobre sua experiência...",
        type: "textarea" as const,
        description: "Opcional - descreva sua experiência profissional",
      },
    },
    
    onSubmit: async (data: any) => {
      console.log("Dados do formulário simples:", data);
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Perfil criado com sucesso! Verifique o console para ver os dados.");
    },
  };

  // Configuração do formulário com valores padrão
  const defaultFormConfig: AutoFormConfig = {
    title: "Formulário de Cadastro Dinâmico (Multi-Step) - Valores Padrão",
    description: "Exemplo com valores pré-preenchidos e campos desabilitados",
    schema: stepFormSchema,
    showProgress: true,
    submitButtonText: "Finalizar Cadastro",
    disabled: true,
    
    defaultValues: {
      name: "João Silva",
      email: "joao.silva@email.com",
      age: 30,
      birth_date: new Date("1994-01-15"),
      notifications: true,
      user_type: "company",
      company_name: "Tech Solutions LTDA",
      company_size: "medium",
      interests: ["tech", "marketing"]
    },
    
    fields: {
      name: {
        label: "Nome Completo",
        placeholder: "Digite seu nome completo",
        type: "text",
        required: true,
      },
      email: {
        label: "Email",
        placeholder: "seu@email.com",
        type: "email",
        required: true,
      },
      age: {
        label: "Idade",
        placeholder: "Sua idade",
        type: "number",
        required: true,
      },
      birth_date: {
        label: "Data de Nascimento",
        placeholder: "Selecione sua data de nascimento",
        type: "date",
        required: true,
      },
      notifications: {
        label: "Desejo receber notificações por email",
        type: "checkbox",
        required: false,
      },
      user_type: {
        label: "Tipo de Usuário",
        type: "select",
        required: true,
        options: [
          { label: "Pessoa Física", value: "individual" },
          { label: "Empresa", value: "company" },
          { label: "Outros", value: "outros" },
        ],
      },
      company_name: {
        label: "Nome da Empresa",
        placeholder: "Digite o nome da empresa",
        type: "text",
        required: true,
        dependsOn: {
          field: "user_type",
          value: "company",
          condition: "equals",
        },
      },
      company_size: {
        label: "Tamanho da Empresa",
        type: "select",
        required: true,
        options: [
          { label: "Pequena (1-10 funcionários)", value: "small" },
          { label: "Média (11-100 funcionários)", value: "medium" },
          { label: "Grande (100+ funcionários)", value: "large" },
        ],
        dependsOn: {
          field: "user_type",
          value: "company",
          condition: "equals",
        },
      },
      interests: {
        label: "Áreas de Interesse",
        type: "select",
        multiple: true,
        options: [
          { label: "Tecnologia", value: "tech" },
          { label: "Marketing", value: "marketing" },
          { label: "Vendas", value: "sales" },
          { label: "Finanças", value: "finance" },
        ],
        dependsOn: {
          field: "user_type",
          value: "outros",
          condition: "not_equals",
        },
      },
      bio: {
        label: "Biografia",
        placeholder: "Conte um pouco sobre você...",
        type: "textarea",
        description: "Máximo de 500 caracteres",
        dependsOn: {
          field: "user_type",
          value: "individual",
          condition: "equals",
        },
      },
    },
    
    steps: [
      {
        title: "Informações Pessoais",
        description: "Dados básicos do usuário",
        fields: ["name", "email", "age", "birth_date"],
      },
      {
        title: "Tipo de Usuário",
        description: "Defina o tipo de conta",
        fields: ["user_type", "company_name", "company_size"],
      },
      {
        title: "Preferências",
        description: "Configure suas preferências",
        fields: ["notifications", "interests", "bio"],
      },
    ],
    
    onSubmit: async (data) => {
      console.log("Dados do formulário com valores padrão:", data);
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Formulário com valores padrão enviado! Verifique o console para ver os dados.");
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Auto Form Component
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Componente de formulário dinâmico com React Hook Form, Zod validation, 
            lógica condicional e suporte a múltiplas etapas.
          </p>
        </div>
        
        <Tabs defaultValue="multi-step" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto mb-8">
            <TabsTrigger value="multi-step">Multi-Step Form</TabsTrigger>
            <TabsTrigger value="default-values">Multi-Step Form (valor padrão)</TabsTrigger>
            <TabsTrigger value="simple">Simple Form</TabsTrigger>
          </TabsList>
          
          <TabsContent value="multi-step">
            <AutoForm {...stepFormConfig} />
          </TabsContent>
          
          <TabsContent value="default-values">
            <AutoForm {...defaultFormConfig} />
          </TabsContent>
          
          <TabsContent value="simple">
            <SimpleForm {...simpleFormConfig} />
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Funcionalidades Implementadas
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  ✅ Core Features
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Schema Zod dinâmico</li>
                  <li>• React Hook Form integrado</li>
                  <li>• Múltiplas etapas (steps)</li>
                  <li>• Formulário simples sem steps</li>
                  <li>• Indicador de progresso</li>
                  <li>• Validação em tempo real</li>
                  <li>• Seleção múltipla em campos select</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  ✅ Lógica Condicional
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Campos condicionais</li>
                  <li>• Campo "_others" automático</li>
                  <li>• Dependências entre campos</li>
                  <li>• Múltiplas condições</li>
                  <li>• Campos dinâmicos</li>
                  <li>• Conversão automática de tipos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
