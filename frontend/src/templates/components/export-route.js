import { jsPDF } from "jspdf";
import 'jspdf-autotable';

export default function pdfRender (route, students) {
    console.log(route)
    console.log(students)

    var line = 18 // Line height to start text at
    var lineHeight = 5
    var leftMargin = 14
    var routeName = "Route: " + route.name
    var routeSchool = "School: " + route.school.name
    var routeStatus = route.is_complete ? "Status: Complete" : "Status: Incomplete"
    var routeInfo = [routeName, routeSchool, routeStatus]
    var studentsList = []
    var studentsObj = []

    for (var i = 0; i < students.length; i++) {
        var dict = students[i]
        studentsObj.push({ 
            "name": dict["first_name"].toString() + " " + dict["last_name"].toString(),
            "student_school_id": dict["student_school_id"].toString(),
            "address": "Address is a even more longer very very very very long address",
            "parent": "Parent First Last",
            "email": "first.last@gmail.com",
            "phone": "9195648284"
        })
    }

    const doc = new jsPDF();
    doc.setFontSize("11");

    for (var i = 0; i < routeInfo.length; i++) {
        doc.text(routeInfo[i], leftMargin, line);
        line = line + lineHeight;
    }

    doc.text("Students", leftMargin, line + lineHeight)

    doc.autoTable({
        columns: [
            { "dataKey": "name", "header": "Student Name" }, 
            { "dataKey": "student_school_id", "header": "ID" }, 
            { "dataKey": "address", "header": "Address" }, 
            { "dataKey": "parent", "header": "Parent Name" }, 
            { "dataKey": "email", "header": "Parent Email" }, 
            { "dataKey": "phone", "header": "Parent Phone" }],
        head: [['Student Name', 'ID', 'Home Address', 'Parent Name', 'Parent Email', 'Parent Phone']],
        showHead: 'everyPage',
        body: studentsObj,
        startY: line + lineHeight * 1.5,
        theme: 'striped',
        tableWidth: 'auto',
        rowPageBreak: 'auto',
        pageBreak: 'auto',
        columnStyles: {
            "name": {halign: 'left', cellWidth: 'auto'}, 
            "student_school_id": {halign: 'left', cellWidth: 'auto'}, 
            "address": {halign: 'left', cellWidth: 'auto'}, 
            "parent": {halign: 'left', cellWidth: 'auto'}, 
            "email": {halign: 'left', cellWidth: 'auto'}, 
            "phone": {halign: 'left', cellWidth: 'auto'}},
        headStyles: {
            fontStyle: 'bold', 
            fillColor: '#495057', 
            textColor: '#ffffff', 
            fontSize: 10, 
            cellWidth: 'wrap'},
        // bodyStyles: {cellWidth: 'wrap', overflow: 'linebreak', halign: 'left', valign: 'middle'},
        styles: { 
            "overflow": "linebreak", 
            "cellWidth": "wrap", 
            "rowPageBreak": "auto", 
            "halign": "left" },
    })

    doc.save("route.pdf");
}