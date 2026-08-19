
export default function pageTitle(title: string) {
    const doc = document?.getElementById("page-title");
    if (doc)
        doc.innerHTML = 'حسابداری مانا | ' + title;
}
