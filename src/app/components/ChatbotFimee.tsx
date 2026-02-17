import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  AlertTriangle,
  User
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

function GenerarPrompt(entrada: string):string {
  // cuerpo
  return `
          Eres un asistente virtual para la Facultad de Ingeniería Mecánica, Eléctrica y Electrónica (FIMEE) 
          de la Universidad Nacional San Luis Gonnzaga De Ica.

          Responde de manera clara y concisa a las preguntas relacionadas con la facultad, como información 
          sobre carreras, contacto, etc.

          Solo responde a consultas o comentarios que conciernan a la facultad y evita temas no relacionados. 
          Si la consulta no es relevante, responde con un mensaje educado indicando que no puedes ayudar con 
          ese tema.

          Lo que sabes:
            - Carreas disponibles: Ing. Mecanica Electrica, Ing. Electronica
            - Proximo Examen de Admision: Aun no hay fecha.
            - Direccion: Av. Los Maestros S/N - Ica.
            - Correo: mesadepartes@unica.edu.pe
            - Tel: (056) 284399

          La Facultad de Ingeniería Mecánica Eléctrica y Electrónica (FIMEE) de la Universidad Nacional "San Luis Gonzaga" es una institución con 58 años de trayectoria dedicada a la formación de ingenieros competitivos en las regiones de Ica, Ayacucho, Huancavelica y Lima Provincias.

          Estructura Académica y Evolución
          Fundada originalmente en 1963, la facultad ha evolucionado mediante hitos normativos clave hasta consolidar su estructura actual:

          Programas Vigentes: Ingeniería Mecánica y Eléctrica (desde 1963) e Ingeniería Electrónica (desde 1998).

          Departamentos: Cuenta con tres unidades académicas: 1) Electricidad y Electrónica, 2) Energía y Producción, y 3) Ciencias de Investigación de la Ingeniería.

          Cuerpo Docente y Calidad
          La formación está liderada por ingenieros altamente calificados, en su mayoría con grados de Magíster y Doctor. Este capital humano garantiza una actualización tecnológica constante y una enseñanza basada en la experiencia técnica y la solidez científica.

          Impacto y Resultados
          La FIMEE se distingue por el alto índice de empleabilidad de sus egresados, quienes ocupan cargos de relevancia en empresas nacionales e internacionales o lideran sus propios emprendimientos, impulsando el desarrollo sostenible y la innovación tecnológica.

          La página web fue creada para brindar información referente a la facultad de Ingeniería Mecánica eléctrica y electrónica.
          
          El botón “Sobre FIMEE” se encarga de dar a conocer la misión y visión de la FIMEE, además de mostrar los años de trayectoria los cuales son más de 50, los más de 2000 estudiantes y los laboratorios.
          
          Ingeniería Mecánica Eléctrica:
            Formamos ingenieros especializados en el diseño, análisis y operación de sistemas mecánicos y eléctricos, con énfasis en manufactura, energía, automatización y sistemas de potencia.
            •Diseño de sistemas mecánicos y eléctricos
            •Análisis de sistemas de potencia
            •Automatización industrial
            •Manufactura avanzada
          Plan de estudios actualizado con cursos de diseño mecánico, sistemas eléctricos, automatización y control.
            10 ciclos académicos
            220 créditos
          
          Ingeniería Electrónica:
            Ingenieros especializados en sistemas electrónicos, telecomunicaciones, control automático, diseño de circuitos electrónicos avanzados y sistemas digitales.
            •Diseño de circuitos electrónicos
            •Sistemas digitales
            •Telecomunicaciones
            •Control automático
          Plan de estudios enfocado en sistemas electrónicos, telecomunicaciones, microprocesadores y sistemas digitales.
            10 ciclos académicos
            218 créditos
          
          En el botón “Docentes” muestra la cantidad de docentes de la facultad, con su CTI respectivamente
          
          El botón “Autoridades” figura todas las personas que dirigen la facultad, el decano: Dr. Reymundo Calderón Pino
          
          Director de escuela de electrónica: 
            - Mag. José Armando Chávez Espinoza
          
          Director de escuela de mecánica eléctrica:
            - Mag. Percy Abel Gonzáles Allauja
            
          Directores de departamento académico: 
            - Dr. Javier Orlando Gutiérrez Ferreyra
            - Mag. Mario Efraín Benavides Palomino
            - Dr. José Demetrio Morales Valencia
          
          Director de unidad de investigación:
            - Dr. José Luis Donayre Pasache
          
          Director de unidad de posgrado
            - Dr. Fernando Alberto Eugenio Guerrero Salazar
          
          El botón de “Aula virtual” lleva al aula virtual de nuestra facultad, la cual cuenta con todo lo necesario para que todos los alumnos puedan subir sus tareas, ver sus cursos matriculados, etc-
          
          Entrada del usuario: ${entrada}
        `;
}

const APIKEY = "AIzaSyBmW-7fqLQwJegpyKDmke0rBlg6lOe_pLk";
let session = new GoogleGenAI({
  apiKey: APIKEY
})
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  isError?: boolean;
}

export function ChatbotFimee() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy el asistente virtual de la FIMEE. ¿En qué puedo ayudarte hoy?',
      sender: 'bot'
    }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al recibir nuevos mensajes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    session.models.generateContent({
      model: "gemini-2.5-flash",
      contents: GenerarPrompt(userMessage.text),
    })
    .then((res) => {
      console.log(res.text)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: res.text ?? 'Lo siento, no pude generar una respuesta en este momento.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    }).catch((e) => {
      console.log(e)
    })
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-80 md:w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
          >
            {/* Header del Chat */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Chatbot FIMEE</h3>
                  <p className="text-[10px] opacity-80">En línea ahora</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Cuerpo del Chat */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950/50"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`p-2 rounded-full ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-800'}`}>
                      {msg.sender === 'user' ? <User className="w-3 h-3 text-white" /> : <Bot className="w-3 h-3 text-blue-600" />}
                    </div>
                    
                    <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : msg.isError 
                          ? 'bg-gray-600 text-gray-200 flex items-center gap-2 rounded-tl-none border border-red-500/30'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'
                    }`}>
                      {msg.isError && <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />}
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input de Mensajes */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500"
                />
                <Button 
                  onClick={handleSend}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón Flotante */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl flex items-center justify-center text-white border-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </motion.div>
    </div>
  );
}
