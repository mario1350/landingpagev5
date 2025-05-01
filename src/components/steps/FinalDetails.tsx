import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, DownloadIcon, ShareIcon, CalendarIcon, MailIcon } from 'lucide-react';
import { useQuoteStore } from '../../context/QuoteContext';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../lib/utils';

export const FinalDetails: React.FC = () => {
  const { 
    contactInfo,
    systemSummary,
    calculationResults,
    financialSummary,
    reset
  } = useQuoteStore();
  
  const [isScheduling, setIsScheduling] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleScheduleCall = () => {
    setIsScheduling(true);
  };
  
  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };
  
  const handleStartOver = () => {
    reset();
  };
  
  if (!systemSummary || !calculationResults || !financialSummary) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-gray-700">Cargando resumen final...</p>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto pt-10 sm:pt-20 px-4 sm:px-0 pb-20"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircleIcon size={40} className="text-success-600" />
        </motion.div>
        
        <h2 className="text-3xl font-bold mb-2 text-gray-800">
          ¡Tu Cotización Está Lista!
        </h2>
        
        <p className="text-lg text-gray-600">
          Gracias {contactInfo.name}, aquí está el resumen de tu sistema solar personalizado.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">Detalles del Sistema</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Capacidad del Sistema</p>
              <p className="text-lg font-semibold">{(systemSummary.panels * 0.55).toFixed(2)} kW</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Paneles Solares</p>
              <p className="text-lg font-semibold">{systemSummary.panels}x Seraphim 550W</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Microinversores</p>
              <p className="text-lg font-semibold">{systemSummary.microinverters}x Hoymiles HMS</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Almacenamiento</p>
              <p className="text-lg font-semibold">FranklinWh aPower + aGate</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Producción Mensual Estimada</p>
              <p className="text-lg font-semibold">{Math.round(calculationResults.produccionMensualEstimada)} kWh</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Cobertura de Consumo</p>
              <p className="text-lg font-semibold">{Math.round(calculationResults.coveragePercent)}%</p>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-4 border-b pb-2">Resumen Financiero</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Inversión Total</p>
              <p className="text-lg font-semibold">{formatCurrency(systemSummary.fullPrice)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Plazo de Financiamiento</p>
              <p className="text-lg font-semibold">{financialSummary.financingTerm} años @ {financialSummary.interestRate}% APR</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Pago Mensual</p>
              <p className="text-lg font-semibold">{formatCurrency(financialSummary.monthlyPayment)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Ahorro Anual (Primer Año)</p>
              <p className="text-lg font-semibold">{formatCurrency(calculationResults.yearOneSavings)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Ahorros Durante Vida Útil</p>
              <p className="text-lg font-semibold">{formatCurrency(calculationResults.lifetimeSavings)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Retorno de Inversión</p>
              <p className="text-lg font-semibold">~{calculationResults.paybackPeriod} años</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                alert("Cotización enviada a tu correo electrónico");
              }}
            >
              <DownloadIcon size={18} />
              Descargar Cotización
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                alert("Enlace copiado al portapapeles");
              }}
            >
              <ShareIcon size={18} />
              Compartir
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          {!isScheduling && !isSubmitted ? (
            <>
              <h3 className="text-xl font-bold mb-4">¿Qué sigue?</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="font-semibold text-primary-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Consulta con un especialista</p>
                    <p className="text-sm text-gray-500">
                      Agenda una llamada para resolver dudas y personalizar tu sistema.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="font-semibold text-primary-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Confirma tu pedido</p>
                    <p className="text-sm text-gray-500">
                      Formaliza tu compra y programa la instalación.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="font-semibold text-primary-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Instalación profesional</p>
                    <p className="text-sm text-gray-500">
                      Nuestros técnicos certificados instalarán tu sistema.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button
                className="w-full flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600"
                onClick={handleScheduleCall}
              >
                <CalendarIcon size={18} />
                Programar Consulta
              </Button>
            </>
          ) : isSubmitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6"
            >
              <CheckCircleIcon size={50} className="text-success-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">¡Solicitud Enviada!</h3>
              <p className="text-gray-600 mb-6">
                Nos pondremos en contacto contigo pronto para coordinar tu consulta.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleStartOver}
              >
                Iniciar Nueva Cotización
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h3 className="text-xl font-bold mb-4">Programa tu Consulta</h3>
              <form onSubmit={handleSubmitEmail}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={contactInfo.name}
                    readOnly
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={contactInfo.phone}
                    readOnly
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Enviando...'
                  ) : (
                    <>
                      <MailIcon size={18} />
                      Enviar Solicitud
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="bg-primary-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Garantía y Soporte SunCom</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-medium mb-2 text-primary-700">Garantía de 25 Años</h4>
            <p className="text-sm text-gray-600">Cobertura completa para todos los componentes del sistema.</p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-medium mb-2 text-primary-700">Monitoreo 24/7</h4>
            <p className="text-sm text-gray-600">Seguimiento en tiempo real del rendimiento de tu sistema.</p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-medium mb-2 text-primary-700">Soporte Técnico</h4>
            <p className="text-sm text-gray-600">Asistencia técnica especializada siempre disponible.</p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-medium mb-2 text-primary-700">Transferibilidad</h4>
            <p className="text-sm text-gray-600">Garantía transferible en caso de venta de la propiedad.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};