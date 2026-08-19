export const customFaLocaleText = {
    // Root
    noRowsLabel: 'هیچ رکوردی یافت نشد',
    noResultsOverlayLabel: 'نتیجه‌ای یافت نشد.',

    // Density selector toolbar button text
    toolbarDensity: 'تراکم',
    toolbarDensityLabel: 'تراکم',
    toolbarDensityCompact: 'فشرده',
    toolbarDensityStandard: 'استاندارد',
    toolbarDensityComfortable: 'راحت',

    // Columns selector toolbar button text
    toolbarColumns: 'ستون‌ها',
    toolbarColumnsLabel: 'انتخاب ستون‌ها',

    // Filters toolbar button text
    toolbarFilters: 'فیلترها',
    toolbarFiltersLabel: 'نمایش فیلترها',
    toolbarFiltersTooltipHide: 'مخفی کردن فیلترها',
    toolbarFiltersTooltipShow: 'نمایش فیلترها',
    toolbarFiltersTooltipActive: (count: number) =>
        count !== 1 ? `${count} فیلتر فعال` : `${count} فیلتر فعال`,

    // Export selector toolbar button text
    toolbarExport: 'خروجی',
    toolbarExportLabel: 'خروجی',
    toolbarExportCSV: 'دانلود به صورت CSV',
    toolbarExportPrint: 'چاپ',

    // Columns panel text
    columnsPanelTextFieldLabel: 'پیدا کردن ستون',
    columnsPanelTextFieldPlaceholder: 'عنوان ستون',
    columnsPanelDragIconLabel: 'تغییر ترتیب ستون',
    columnsPanelShowAllButton: 'نمایش همه',
    columnsPanelHideAllButton: 'مخفی کردن همه',

    // Filter panel text
    filterPanelAddFilter: 'افزودن فیلتر',
    filterPanelDeleteIconLabel: 'حذف',
    filterPanelLogicOperator: 'عملگر منطقی',
    filterPanelOperator: 'عملگر',
    filterPanelOperatorAnd: 'و',
    filterPanelOperatorOr: 'یا',
    filterPanelColumns: 'ستون‌ها',
    filterPanelInputLabel: 'مقدار',
    filterPanelInputPlaceholder: 'فیلتر مقدار',

    // Filter operators text
    filterOperatorContains: 'شامل',
    filterOperatorEquals: 'مساوی',
    filterOperatorStartsWith: 'شروع با',
    filterOperatorEndsWith: 'پایان با',
    filterOperatorIs: 'هست',
    filterOperatorNot: 'نیست',
    filterOperatorAfter: 'بعد از',
    filterOperatorOnOrAfter: 'در یا بعد از',
    filterOperatorBefore: 'قبل از',
    filterOperatorOnOrBefore: 'در یا قبل از',
    filterOperatorIsEmpty: 'خالی است',
    filterOperatorIsNotEmpty: 'خالی نیست',
    filterOperatorIsAnyOf: 'هر یک از',

    // Filter values text
    filterValueAny: 'هر',
    filterValueTrue: 'صحیح',
    filterValueFalse: 'غلط',

    // Column menu text
    columnMenuLabel: 'منو',
    columnMenuShowColumns: 'نمایش ستون‌ها',
    columnMenuFilter: 'فیلتر',
    columnMenuHideColumn: 'مخفی',
    columnMenuUnsort: 'عدم مرتب‌سازی',
    columnMenuSortAsc: 'مرتب‌سازی صعودی',
    columnMenuSortDesc: 'مرتب‌سازی نزولی',

    // Column header text
    columnHeaderFiltersTooltipActive: (count: number) =>
        count !== 1 ? `${count} فیلتر فعال` : `${count} فیلتر فعال`,
    columnHeaderFiltersLabel: 'نمایش فیلترها',
    columnHeaderSortIconLabel: 'مرتب‌سازی',

    // Rows selected footer text
    footerRowSelected: (count: number) =>
        count !== 1
            ? `${count.toLocaleString()} رکورد انتخاب شده`
            : `${count.toLocaleString()} رکورد انتخاب شده`,

    // Total rows footer text
    footerTotalRows: 'مجموع رکوردها:',

    // Total visible rows footer text
    footerTotalVisibleRows: (visibleCount: number, totalCount: number) =>
        `${visibleCount.toLocaleString()} از ${totalCount.toLocaleString()}`,

    // Pagination footer text
    MuiTablePagination: {
        labelRowsPerPage: 'ردیف در صفحه:',
        labelDisplayedRows: ({ from, to, count }: { from: number, to: number, count: number }) =>
            `${from}-${to} از ${count !== -1 ? count : `more than ${to}`}`,
    },

    // Checkbox selection text
    checkboxSelectionHeaderName: 'انتخاب',

    // Boolean cell text
    booleanCellTrueLabel: 'بله',
    booleanCellFalseLabel: 'خیر',
};