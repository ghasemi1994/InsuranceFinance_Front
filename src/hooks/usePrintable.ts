import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function usePrintable() {

    const componentRef = useRef(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: '',      
        onAfterPrint: () => console.log('چاپ به پایان رسید.'),
        pageStyle: `
          @page { 
            size: A4; 
            margin: 0cm;
            margin-top: 0;
            margin-bottom: 0;
            direction:'rtl';
          }
          @media print { 
            body , html {
              font-family: 'iran-sans-font', sans-serif;
              -webkit-print-color-adjust: exact;
              direction: rtl;
            }       
          }
        `
    });

    return {
        handlePrint,
        componentRef 
    }
}
