import React, { useContext } from 'react';
import { Radar } from 'react-chartjs-2';
import useWindowDimensions from "../../../customHooks/useWindowDimensions";
import { Button } from "@material-ui/core";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { FormContext } from "../../contexts/FormContext";


const testInfo = "Ce test vise à évaluer la maturité numérique de votre association. Les résultats vous sont donnés à titre indicatif. Aucune des informations que vous avez fournies dans le questionnaire ne sera utilisée par Solidaritech pour une quelconque fin autre qu'analytique.";

const logoDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAABzCAYAAAD5TMLoAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Qjc2M0NCQUY0OTVCMTFFOUJCMDVDMzA0ODkxODdCRkYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Qjc2M0NCQjA0OTVCMTFFOUJCMDVDMzA0ODkxODdCRkYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCNzYzQ0JBRDQ5NUIxMUU5QkIwNUMzMDQ4OTE4N0JGRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCNzYzQ0JBRTQ5NUIxMUU5QkIwNUMzMDQ4OTE4N0JGRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpIE1+EAABwFSURBVHja7F0HnFxV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"

function removeDiacritics (str) {
    var defaultDiacriticsRemovalMap = [
        {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
        {'base':'AA','letters':/[\uA732]/g},
        {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
        {'base':'AO','letters':/[\uA734]/g},
        {'base':'AU','letters':/[\uA736]/g},
        {'base':'AV','letters':/[\uA738\uA73A]/g},
        {'base':'AY','letters':/[\uA73C]/g},
        {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
        {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
        {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
        {'base':'DZ','letters':/[\u01F1\u01C4]/g},
        {'base':'Dz','letters':/[\u01F2\u01C5]/g},
        {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
        {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
        {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
        {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
        {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
        {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
        {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
        {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
        {'base':'LJ','letters':/[\u01C7]/g},
        {'base':'Lj','letters':/[\u01C8]/g},
        {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
        {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
        {'base':'NJ','letters':/[\u01CA]/g},
        {'base':'Nj','letters':/[\u01CB]/g},
        {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
        {'base':'OI','letters':/[\u01A2]/g},
        {'base':'OO','letters':/[\uA74E]/g},
        {'base':'OU','letters':/[\u0222]/g},
        {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
        {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
        {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
        {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
        {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
        {'base':'TZ','letters':/[\uA728]/g},
        {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
        {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
        {'base':'VY','letters':/[\uA760]/g},
        {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
        {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
        {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
        {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
        {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
        {'base':'aa','letters':/[\uA733]/g},
        {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
        {'base':'ao','letters':/[\uA735]/g},
        {'base':'au','letters':/[\uA737]/g},
        {'base':'av','letters':/[\uA739\uA73B]/g},
        {'base':'ay','letters':/[\uA73D]/g},
        {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
        {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
        {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
        {'base':'dz','letters':/[\u01F3\u01C6]/g},
        {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
        {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
        {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
        {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
        {'base':'hv','letters':/[\u0195]/g},
        {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
        {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
        {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
        {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
        {'base':'lj','letters':/[\u01C9]/g},
        {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
        {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
        {'base':'nj','letters':/[\u01CC]/g},
        {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
        {'base':'oi','letters':/[\u01A3]/g},
        {'base':'ou','letters':/[\u0223]/g},
        {'base':'oo','letters':/[\uA74F]/g},
        {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
        {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
        {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
        {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
        {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
        {'base':'tz','letters':/[\uA729]/g},
        {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
        {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
        {'base':'vy','letters':/[\uA761]/g},
        {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
        {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
        {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
        {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
    ];
    for(var i=0; i<defaultDiacriticsRemovalMap.length; i++) {
        str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
    }
    return str.replace(/[\u0080-\uffff]/g, '');
}

function space(str,lengthline) {
    var nbreligne = 0;
    const long = str.length;
    nbreligne = Math.trunc(long/lengthline) + 1;
    return(nbreligne);
}

function getImageFormat(base64Image) {
    const urlBeginning = base64Image.substring(0,19);
    const interRes = urlBeginning.split("data:image/")[1];
    return interRes.split(";")[0]
}

export function MyRadarChart(props) {

    const suggestedProducts = props.suggestedProducts;
    const suggestedTutorials = props.suggestedTutorials;

    const { width } = useWindowDimensions();
    const { themes } = useContext(FormContext);
    
    var splitLabels = [];
    for (var label of props.labels) {
        splitLabels.push(label.split(" "))
    }

    const data = {
        labels: splitLabels,
        datasets: [
          {
            backgroundColor: 'rgba(213,213,213,0.5)',
            borderColor: 'rgb(144, 208, 88)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: props.data
          },
        ]
    };

    const createPDF = (event) => {
        let input = document.getElementById("radar");
        
        html2canvas(input).then(canvas => {
            const imgUrl = canvas.toDataURL("image/png");
            var currenty = 10;
            var currentx = 15;
            const ratio = 0.2;
            const widthgraph = 400*ratio;
            const heightgraph = 400*ratio;
            const sizeicon = 10;
            const maxw = 195;
            const minw= 15;
            const centerx = (maxw+minw)/2;
            const sizefontsubtitle = 18;
            const sizefonttext = 9;
            const sizefonttitle = 30;
            const spaceundersubtitle = 5;
            const spaceunderline = 8;
            const circleradius = 4;
            const spacebetweenaline = 3;
            const numberofcharacterbyline = 42;
            const pdf = new jsPDF('mm');
            const pdfHeight = pdf.internal.pageSize.getHeight() - 20;

            // pdf construction
            pdf.setFont("helvetica");

            pdf.addImage(logoDataUrl, 'png', 92, currenty, 25, 18);
            currenty += 35;

            pdf.setFontSize(sizefonttitle);
            pdf.setFontType('bold');
            pdf.setDrawColor('88cc17');
            pdf.text('Les résultats de votre test', centerx, currenty, 'center');
            pdf.setFontType('normal');
            currenty += 15;

            pdf.setFontSize(sizefontsubtitle);
            pdf.setFontType('bold');
            pdf.text('A propos du test', currentx, currenty);
            pdf.setFontType('normal');
            currenty += spaceundersubtitle;
            pdf.line(currentx, currenty, maxw, currenty,'S');
            pdf.setFontSize(sizefonttext);
            currenty += spaceunderline;
            pdf.text(currentx, currenty, testInfo, {align : 'justify', maxWidth : 180});
            currenty += 25;

            pdf.setFontSize(sizefontsubtitle);
            pdf.setFontType('bold');
            pdf.text('Vos résultats en image', currentx, currenty);
            currenty += spaceundersubtitle;
            pdf.line(currentx, currenty, 195, currenty);
            currenty += 10; 

            pdf.addImage(imgUrl,'png', centerx-widthgraph/2, currenty, widthgraph, heightgraph );
            currenty += heightgraph + 15;
            pdf.text('Nos recommandations', currentx, currenty);
            currenty += spaceundersubtitle;
            pdf.line(currentx, currenty, maxw, currenty);
            currenty += spaceunderline+5;
            
            for (var theme of themes) {

                pdf.setFontSize(16);
                if (currenty>pdfHeight-20){
                    pdf.addPage('a4','p');
                    currenty = 20;
                };

                // we check if there are indeed recommendations in the considered theme
                const themeProductRecoNb = suggestedProducts[theme].length;
                const themeTutorialRecoNb = suggestedTutorials[theme].length;
                pdf.setFontType('italic');
                if ((themeProductRecoNb > 0) || (themeTutorialRecoNb > 0)) {
                    pdf.circle(currentx+circleradius/2,currenty-circleradius/2,circleradius/2,'F');
                    pdf.text(theme,currentx + circleradius/2 + 5,currenty);
                    currenty += spaceunderline;
                }

                // we add all the recommended products from the theme
                if (themeProductRecoNb > 0) {
                    currenty += 5;
                    pdf.setFontType('normal')
                    pdf.setFontSize(15);
                    pdf.text('- Quelques produits :',currentx,currenty)
                    currenty += spaceunderline;
                    var currenty1 = currenty;
                    var currenty2 = currenty;
                    var column = 1;
                    pdf.setFontSize(sizefonttext);
                    pdf.setFontType('normal');
                    var mini = currenty1;

                    for (var product of suggestedProducts[theme]) {
                        if (mini > pdfHeight -(space(removeDiacritics(product.productDescription),numberofcharacterbyline)*spacebetweenaline + space(removeDiacritics(product.productName),numberofcharacterbyline)*4 + 5)) {
                            pdf.addPage('a4','p');
                            currenty1 = 20;
                            currenty2 = 20;
                            column = 1;
                            currentx = 15;
                            mini = 20;
                        }


                        const img = product.productPhoto;
                        if (img !== "") {
                            const imgFormat = getImageFormat(img);
                            pdf.addImage(img,imgFormat,currentx,mini,sizeicon,sizeicon);
                        }
                        pdf.setFontType('bold');
                        pdf.textWithLink(removeDiacritics(product.productName),currentx+17,mini+1,{url: product.productLink, maxWidth : 65, align:"left"});
                        pdf.setFontType('normal');
                        pdf.text(currentx+17,mini+1+space(removeDiacritics(product.productName),numberofcharacterbyline)*4,removeDiacritics(product.productDescription),{align : 'justify', maxWidth : 65});

                        mini += space(removeDiacritics(product.productDescription),numberofcharacterbyline)*spacebetweenaline + space(removeDiacritics(product.productName),numberofcharacterbyline)*4 + 5;

                        if (product.tutorials.length > 0) {
                            //
                            pdf.setFontType('italic');
                            pdf.text(currentx+17, mini+1, '• Quelques ressources :');
                            pdf.setFontType('normal');
                            mini += 4;
                            //
                            for (var tutorial of product.tutorials) {
                                pdf.text(currentx + 17, mini + 1,tutorial.tutorialLink,{maxWidth: 65/* + 10*/});
                                mini += space(tutorial.tutorialLink, numberofcharacterbyline + 17)*spacebetweenaline
                            }
                        }
                        mini += 10;

                        if (column === 1){
                            currenty1 = mini;
                        } else {
                            currenty2 = mini;
                        }

                        if (currenty1 > currenty2) {
                            column = 2;
                            currentx = 15 + 98;
                            mini = currenty2;
                        } else {
                            column = 1;
                            currentx = 15;
                            mini = currenty1;
                        }
                    }
                    currentx = 15;
                    currenty = Math.max(currenty1,currenty2);
                }

                if (currenty > pdfHeight-10) {
                    pdf.addPage('a4','p');
                    currenty = 20;
                }


                if (themeTutorialRecoNb > 0) {
                    currenty += 5;
                    pdf.setFontType('normal')
                    pdf.setFontSize(15);
                    pdf.text('- Quelques tutoriels :',currentx,currenty)
                    currenty += spaceunderline;
                    var currenty1 = currenty;
                    var currenty2 = currenty;
                    var column = 1;
                    pdf.setFontSize(sizefonttext);
                    pdf.setFontType('normal');
                    var mini = currenty1;

                    for (var tutorial of suggestedTutorials[theme]) {
                        if (mini > pdfHeight - (space(removeDiacritics(tutorial.tutorialDescription),numberofcharacterbyline + 17)*spacebetweenaline + space(removeDiacritics(tutorial.tutorialName),numberofcharacterbyline + 10)*4 + 10)) {
                            pdf.addPage('a4','p');
                            currenty1 = 20;
                            currenty2 = 20;
                            column = 1;
                            currentx = 15;
                            mini = 20;
                        }

                        pdf.setFontType('bold');
                        pdf.text(currentx,mini+1,removeDiacritics(tutorial.tutorialName),{maxWidth : 65+10, align:"left"});
                        pdf.setFontType('normal');
                        pdf.text(currentx,mini+1+space(tutorial.tutorialName,numberofcharacterbyline + 3)*4,removeDiacritics(tutorial.tutorialDescription),{align : 'justify', maxWidth : 65+17});
                        
                        mini += space(removeDiacritics(tutorial.tutorialDescription),numberofcharacterbyline + 17)*spacebetweenaline + space(removeDiacritics(tutorial.tutorialName),numberofcharacterbyline + 10)*4 + 10;
                        pdf.setFontType('italic');
                        pdf.text(currentx, mini+1, '• Lien du tutoriel :');
                        pdf.setFontType('normal');
                        mini += 4;
                        pdf.text(currentx, mini + 1, tutorial.tutorialLink, {maxWidth: 65 + 10});
                        mini += 10;

                        if (column === 1){
                            currenty1 = mini;
                        } else {
                            currenty2 = mini;
                        }


                        if (currenty1 > currenty2) {
                            column = 2;
                            currentx = 15 + 98;
                            mini = currenty2;
                        } else {
                            column = 1;
                            currentx = 15;
                            mini = currenty1;
                        }
                    }
                    currenty = Math.max(currenty1,currenty2);
                    currentx = 15;
                }
                currenty += 5 + 5;
            }

            pdf.save('resultats.pdf');
        })
    }

    return (
        <>  
            <div id="radar">
                <Radar 
                    data={data} 
                    height={width<600?width-60:500}   
                    width={width<600?width-60:500}
                    options={{ 
                        maintainAspectRatio: false,
                        legend: {
                            display: false
                        },
                        scale: {
                            pointLabels: {
                                fontSize: props.windowSizeHook()?10:12
                            }
                        },
                        animation: false
                    }}
                />
            </div>    
            <div style={{marginTop:"10px", textAlign:"center"}}>
                <Button onClick={createPDF} variant="outlined" style={{backgroundColor:"rgb(144, 208, 88)", color:"white", borderColor:"rgb(144, 208, 88)"}}>
                    Télécharger vos résultats complets en PDF
                </Button>
            </div>    
        </>

        
    )
}
