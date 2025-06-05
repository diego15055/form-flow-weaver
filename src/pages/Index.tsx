import { z } from "zod";
import { AutoForm } from "@/components/auto-form2";
import { AutoFormConfig } from "@/types/auto-form";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  age: z.number().min(18, "Idade mínima é 18 anos").max(120, "Idade máxima é 120 anos"),
  birth_date: z.date(), 
  notifications: z.boolean(),
  notifications_others: z.string().optional(),
  user_type: z.enum(["individual", "company", "outros"]),
  user_type_others: z.string().optional(),
  company_name: z.string().optional(),
  company_size: z.enum(["small", "medium", "large"]).optional(),
  interests: z.array(z.string()).optional(),
  os: z.string(),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres").optional(),
});

const Index = () => {
  const formConfig: AutoFormConfig = {
    title: "Titulo do Formulário",
    description: "Descrição do Formulário",
    schema: formSchema,
    showProgress: true,
    submitButtonText: "Finalizar Cadastro",
    disabled: false,
    
    // defaultValues: {
    //   name: "Diego Santos",
    //   email: "diego.santos2@ibm.com",
    //   age: 26,
    //   birth_date: new Date("1994-01-15"),
    //   notifications: true,
    //   user_type: "company",
    //   company_name: "SecureCore",
    //   company_size: "medium",
    //   interests: ["tech", "marketing"],
    //   os: "macos",
    //   bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    // },
    
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
      os: {
        label: "Selecione seu sistema operacional preferido",
        placeholder: "Selecione seu sistema operacional preferido",
        type: "radio",
        required: true,
        options: [
            { label: "MacOS", value: "macos" },
            { label: "Windows", value: "windows" },
            { label: "Linux", value: "linux" },
        ]
    },
    },
    
    // steps: [
    //   {
    //     title: "Informações Pessoais",
    //     description: "Dados básicos do usuário",
    //     fields: ["os", "name", "email", "age", "birth_date"],
    //   },
    //   {
    //     title: "Tipo de Usuário",
    //     description: "Defina o tipo de conta",
    //     fields: ["user_type", "company_name", "company_size"],
    //   },
    //   {
    //     title: "Preferências",
    //     description: "Configure suas preferências",
    //     fields: ["notifications", "interests", "bio"],
    //   },
    // ],
    
    onSubmit: async (data) => {
      console.log("Dados do formulário com valores padrão:", data);
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Formulário com valores padrão enviado! Verifique o console para ver os dados.");
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="container mx-auto">     
        <AutoForm {...formConfig} />  
      </div>
    </div>
  );
};

export default Index;
