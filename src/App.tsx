import {useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  type: "bot" | "user";
  text: React.ReactNode;
};

const ANSWERS = {
  intro: (
    <p>
      Soy Nicolas Cugno, soy Programador y estudiante de ingenieria en sistemas, me considero una persona muy social y proactiva, 
      me gustan los desafios y la logica. 
      A lo largo de mi vida siempre me gusto aprender y me considero una persona curiosa!!
    </p>
  ),
  Trabajo: (
    <p> 
      Tengo experiencia en Python, Java, Typescript, React, HTML, Css, fastApi, SQL, entre otras tecnologias. Tambien hablo español como idioma nativo, ingles avanzado y aleman basico.
      Actualmente me encuentro buscando trabajo. Tengo 18 años y vivo en Cordoba, Argentina.</p>
  ),
  
  Contacto: (
    <p>
      Puedes Contactar directamente conmigo por mi {" "}
      <a
        className="underline"
        href="https://github.com/nicocugno2"
        rel="noopener noreferrer"
        target="_blank"
        >
        Github
      </a>{" "}
        ,mi{" "}
      <a 
        className="underline"
        href="https://mail.google.com/mail/u/3/#inbox"
        rel="noopener noreferrer"
        target="_blank"
      >
        Email
      </a>{" "}
      o por mi{" "}
      <a
        className="underline"
        href="https://www.linkedin.com/in/nicol%C3%A1s-cugno-8b692b1bb/"
        rel="noopener noreferrer"
        target="_blank"
      >
        Linkedin
      </a>
      .
  </p>
  ),

  default: (
    <p>En realidad no soy Nico, soy una IA que esta programada para dar iformacion sobre el
      , si la respuesta no era la que esperabas, reformula la pregunta
    </p>
  ),
}

const EXAMPLES = [{"text": "Hola", "label": "intro"}, {"text": "Quien sos?", "label": "intro"}, {"text": "Estas buscando trabajo?", "label": "Trabajo"}, {"text": "Donde puedo comunicarme con vos?", "label": "Contacto"}, {"text": "Por donde te puedo contactar?", "label": "Contacto"}, {"text": "Que experiencia tenes?", "label": "Trabajo"}, {"text": "Estas trabajando?", "label": "Trabajo"}, {"text": "Con que tecnologias tenes experiencia=", "label": "Trabajo"}, {"text": "Estas escuchando propuestas?", "label": "Trabajo"}, {"text": "Sabes algun idoma?", "label": "Trabajo"}, {"text": "Tenes experiencia en python?", "label": "Trabajo"}, {"text": "Tenes experiencia en Java?", "label": "Trabajo"}, {"text": "Cuantos años de experiencia tenes?", "label": "Trabajo"}, {"text": "Te condieras una persona proactiva?", "label": "intro"}, {"text": "Como es tu linkeddin?", "label": "Contacto"}, {"text": "Como es tu GitHub?", "label": "Contacto"}, {"text": "Tenes curriculum?", "label": "Contacto"}, {"text": "que tal", "label": "intro"}]
const API_KEY = "oHEc45pUQvOTR6l98jjQiQCTowNqH9IDYwSKtzy5"





function ChatBot(){
  const[messages, setMessages] = useState<Message[]>([ 
    {
      id: "1",
      type:  "bot",
      text: "Hola. soy un bot programado para contestar algunas preguntas sobre Nico! Haceme tu pregunta"
    },
  ]);

  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const container = useRef<HTMLDivElement>(null);

    
  async function handleSubmit(event: React.FormEvent){
    event.preventDefault();

    if(loading) return;

    setLoading(true);
    setMessages((messages) => 
    messages.concat({id: String(Date.now()), type: "user", text: question}),
    );
    setQuestion("");

    const {classifications} = await fetch("https://api.cohere.ai/classify",{
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-type": "application/json", 
    },
    body: JSON.stringify({
      model: "large",
      inputs: [question],
      examples: EXAMPLES,
      }),
    }).then(res => res.json());



    setMessages((messages) => 
    messages.concat({id: String(Date.now()),
      type: "bot",
      text: ANSWERS[classifications[0].prediction as keyof typeof ANSWERS] || ANSWERS["default"] }),
    );

    setLoading(false);

      
  }

  useEffect(() =>{
    container.current?.scrollTo(0, container.current.scrollHeight);
  }, [messages]);
    

  return (
    <main className="p-4">
      <div className="flex flex-col gap-4 m-auto max-w-lg border border-purple-600 p-4 rounded-md">
        <div ref={container} className="flex flex-col gap-4 h-[700px] overflow-y-auto ">
          {messages.map((message) => ( 
            <div key={message.id} 
              className={`p-4  max-w-[80%] rounded-3xl text-white ${
                message.type === "bot" 
                  ? "bg-blue-600 text-left self-start rounded-bl-none" 
                  : "bg-purple-900 text-right self-end rounded-br-none"
              } `} 
            >
              {message.text}
            </div>
          ))}
        </div>
        <form className="flex item-center" onSubmit={handleSubmit}>
          <input 
          value={question}
          onChange= {(event) => setQuestion(event.target.value)}
            placeholder="Hace tu Pregunta.."
            className="rounded rounded-r-none flex-1 border border-gray-400 py-2 px-4" 
            type="text"
            name="question"
          />
          <button className={`px-4 py-2 bg-purple-900 rounded-lg rounded-l-none ${loading ? "bg-blue-300" : "bg-blue-500" }`}  type="submit">
            ↩
          </button>
        </form>
      </div>
      
    </main>
  );
}

export default ChatBot;
