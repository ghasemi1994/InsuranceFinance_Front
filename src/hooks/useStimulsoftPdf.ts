
interface StimulsoftPdfHookProps {
    reportPathFile: string;
    dataSetName: string;
    data: object;
    reportName?: string;
}

export const useStimulsoftPdf = () => {
    const exportToPdf = async ({ reportPathFile, dataSetName, data, reportName }: StimulsoftPdfHookProps) => {
        try {
            if (!(window as any).Stimulsoft) {
                throw new Error('Stimulsoft library not loaded');
            }

            // Create and load report
            var report = new (window as any).Stimulsoft.Report.StiReport();

            await report.loadFile(reportPathFile);

            // Prepare and register data
            var dataSet = new (window as any).Stimulsoft.System.Data.DataSet(dataSetName);

            dataSet.readJson(JSON.stringify(data));
            report.regData(dataSetName, dataSetName, dataSet);
            report.dictionary.databases.clear();

            // Render and export
            await report.renderAsync2();

            var pdfData = await report.exportDocumentAsync2((window as any).Stimulsoft.Report.StiExportFormat.Pdf);
            (window as any).Stimulsoft.System.StiObject.saveAs(pdfData, !reportName ? `fileـ${new Date().toLocaleString('fa-IR')}` : reportName + '.pdf', 'application/pdf');

            return true;
        } catch (error) {
            console.error('PDF export failed:', error);
            throw error;
        }
    };

    return { exportToPdf };
};


