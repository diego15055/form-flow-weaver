
import React from "react";
import { z } from "zod";
import { AutoForm } from "@/components/auto-form";
import { AutoFormConfig } from "@/types/auto-form";

// Exemplo de schema Zod complexo
const exampleSchema = z.object({
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
  
  // Interesses (condicional)
  interests: z.array(z.string()).optional(),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres").optional(),
});

const Index = () => {
  const formConfig: AutoFormConfig = {
    title: "Formulário de Cadastro Dinâmico",
    description: "Exemplo completo de auto-form com múltiplas etapas e lógica condicional",
    schema: exampleSchema,
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
      console.log("Dados do formulário:", data);
      
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("Formulário enviado com sucesso! Verifique o console para ver os dados.");
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
        
        <AutoForm {...formConfig} />
        
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
                  <li>• Indicador de progresso</li>
                  <li>• Validação em tempo real</li>
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
