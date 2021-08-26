/*
 * marcus.costa
 * 26/06/2019
 */ 
/* global Highcharts, map, map1, map2, map3, map4, map5, layerHidroSuspeitas */
function getTotalPcdsQuadroGeralRede(){
     $.ajax({
        async: true,
        global: false,        
//        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",/*local cemaden*/
        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",/*meu desk*/
//        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",
        dataType: "json",
        cache: false,
        crossDomain: false,
        success: function (data) {   
            
            /*ALERTA GERAL INATIVIDADE*/
            alertaGeral = data.totalPcds[0][2] * 100 /  data.totalPcds[0][4] ;
            $('#alertaRedeGeral').html('<b>'+alertaGeral.toPrecision(2)+'</b>'); 
            /*ALERTA GERAL INATIVIDADE*/
            
            /*ALERTAS DE INATIVIDADE POR TIPO DE REDE*/
            alertaRedePluvio = data.pluvio[0][2] * 100 / data.pluvio[0][4];
            alertaRedeAcqua = data.acqua[0][2] * 100 / data.acqua[0][4];
            alertaRedeHidro = data.hidro[0][2] * 100 / data.hidro[0][4];
            alertaRedeAgro = data.agro[0][2] * 100 / data.agro[0][4];
            alertaRedeGeo = data.geo[0][2] * 100 / data.geo[0][4];                                
            /*ALERTAS DE INATIVIDADE POR TIPO DE REDE*/
                        
            /*GERAL*/
            var redGeral = document.getElementById('red-alerta-geral');
            var yellowGeral = document.getElementById('yellow-alerta-geral');            
            
            $('#outPut-totalPcdsOperacional').html('<b>'+data.totalPcds[0][0]+'</b>');
            $('#outPut-totalPcdsSuspeitas').html('<b>'+data.totalPcds[0][1]+'</b>');
            $('#outPut-totalPcdsInativas').html('<b>'+data.totalPcds[0][2]+'</b>');
            $('#outPut-totalPcdsDesabilitada').html('<b>'+data.totalPcds[0][3]+'</b>'); 
            $('#outPut-totalPcdsRegistradas').html('<b>'+data.totalPcds[0][4]+'</b>');            
            
            if (alertaGeral >= 50 && alertaGeral <= 70) {
                $(yellowGeral).tooltip({placement: "bottom" ,title: "Inatividade Geral - "+alertaGeral.toPrecision(3)+"%"});                                     
                redGeral.className = 'red-alertGeral red-alert-geral-invisible';
                yellowGeral.className = 'yellow-alertGeral yellow-alert-geral';
            } else if (alertaGeral > 70) {
                $(redGeral).tooltip({placement: "bottom" ,title: "Inatividade Geral - "+alertaGeral.toPrecision(3)+"%"});
                yellowGeral.className = 'yellow-alertGeral yellow-alert-geral-invisible';
                redGeral.className = 'red-alertGeral red-alert-geral';
            }
            /*GERAL*/           
                        
            /*PLUVIO*/             
            var redPluvio = document.getElementById('red-alerta-pluvio');
            var yellowPluvio = document.getElementById('yellow-alerta-pluvio');
            porcentagemAtivasPluvio = data.pluvio[0][0] * 100 / data.pluvio[0][4];            
            porcentagemSuspeitasPluvio = data.pluvio[0][1] * 100 / data.pluvio[0][4];
            porcentagemDesabilitadasPluvio = data.pluvio[0][3] * 100 / data.pluvio[0][4];                        
            $('#outPut-totalPcdsOperacionalPluvio').html('<b>'+data.pluvio[0][0]+'</b>');
            $('#outPut-totalPcdsSuspeitasPluvio').html('<b>'+data.pluvio[0][1]+'</b>');
            $('#outPut-totalPcdsInativasPluvio').html('<b>'+data.pluvio[0][2]+'</b>');
            $('#outPut-totalPcdsDesabilitadaPluvio').html('<b>'+data.pluvio[0][3]+'</b>');                           
            $('#outPut-totalPcdsPluvio').html('<b>'+data.pluvio[0][4]+'</b>');                           
            
            $('#alertaRedePluvio').html(alertaRedePluvio.toPrecision(3));
            $('#porcentagem-inativas-pluvio').html(alertaRedePluvio.toPrecision(3)+'%');            
            $('#porcentagem-ativasPluvio').html(porcentagemAtivasPluvio.toPrecision(3)+'%');
            $('#porcentagem-suspeitasPluvio').html(porcentagemSuspeitasPluvio.toPrecision(3)+'%');
            $('#porcentagem-desabilitadasPluvio').html(porcentagemDesabilitadasPluvio.toPrecision(3)+'%');
            
            if (alertaRedePluvio >= 50 && alertaRedePluvio <= 70) {
                redPluvio.className = 'red-alertPluvio red-alert-pluvio-invisible';
                yellowPluvio.className = 'yellow-alertPluvio yellow-alert-pluvio';
                $(yellowPluvio).tooltip({placement: "bottom" ,title: "Inatividade Pluvio - "+alertaRedePluvio.toPrecision(3)+"%"});
            } else if (alertaRedePluvio > 70) {
                yellowPluvio.className = 'yellow-alertPluvio yellow-alert-pluvio-invisible';
                redPluvio.className = 'red-alertPluvio red-alert-pluvio';
                $(redPluvio).tooltip({placement: "bottom" ,title: "Inatividade Pluvio - "+alertaRedePluvio.toPrecision(3)+"%"});
            }
            /*PLUVIO*/
                                                
            /*ACQUA*/            
            var redAcqua = document.getElementById('red-alerta-acqua');
            var yellowAcqua = document.getElementById('yellow-alerta-acqua');
            porcentagemAtivasAcqua = data.acqua[0][0] * 100 / data.acqua[0][4];            
            porcentagemSuspeitasAcqua = data.acqua[0][1] * 100 / data.acqua[0][4];
            porcentagemDesabilitadasAcqua = data.acqua[0][3] * 100 / data.acqua[0][4];                
            $('#outPut-totalPcdsOperacionalAcqua').html('<b>'+data.acqua[0][0]+'</b>');
            $('#outPut-totalPcdsSuspeitasAcqua').html('<b>'+data.acqua[0][1]+'</b>');
            $('#outPut-totalPcdsInativasAcqua').html('<b>'+data.acqua[0][2]+'</b>');
            $('#outPut-totalPcdsDesabilitadaAcqua').html('<b>'+data.acqua[0][3]+'</b>');                           
            $('#outPut-totalPcdsAcqua').html('<b>'+data.acqua[0][4]+'</b>');            
            
            $('#alertaRedeAcqua').html(alertaRedeAcqua.toPrecision(3));            
            $('#porcentagem-inativas-acqua').html(alertaRedeAcqua.toPrecision(3)+'%');            
            $('#porcentagem-ativasAcqua').html(porcentagemAtivasAcqua.toPrecision(3)+'%');
            $('#porcentagem-suspeitasAcqua').html(porcentagemSuspeitasAcqua.toPrecision(3)+'%');
            $('#porcentagem-desabilitadasAcqua').html(porcentagemDesabilitadasAcqua.toPrecision(3)+'%');
                        
            if (alertaRedeAcqua >= 50 && alertaRedeAcqua <= 70) {
                redAcqua.className = 'red-alertAcqua red-alert-acqua-invisible';
                yellowAcqua.className = 'yellow-alertAcqua yellow-alert-acqua';
                $(yellowAcqua).tooltip({placement: "bottom" ,title: "Inatividade Acqua - "+alertaRedeAcqua.toPrecision(3)+"%"});
            } else if (alertaRedeAcqua > 70) {
                yellowAcqua.className = 'yellow-alertAcqua yellow-alert-acqua-invisible';
                redAcqua.className = 'red-alertAcqua red-alert-acqua';
                $(redAcqua).tooltip({placement: "bottom" ,title: "Inatividade Acqua - "+alertaRedeAcqua.toPrecision(3)+"%"});
            }                                    
            /*ACQUA*/
            
            /*HIDRO*/ 
            var redHidro = document.getElementById('red-alerta-hidro');
            var yellowHidro = document.getElementById('yellow-alerta-hidro');
            porcentagemAtivasHidro = data.hidro[0][0] * 100 / data.hidro[0][4];            
            porcentagemSuspeitasHidro = data.hidro[0][1] * 100 / data.hidro[0][4];
            porcentagemDesabilitadasHidro = data.hidro[0][3] * 100 / data.hidro[0][4];            
            $('#outPut-totalPcdsOperacionalHidro').html('<b>'+data.hidro[0][0]+'</b>');
            $('#outPut-totalPcdsSuspeitasHidro').html('<b>'+data.hidro[0][1]+'</b>');
            $('#outPut-totalPcdsInativasHidro').html('<b>'+data.hidro[0][2]+'</b>');
            $('#outPut-totalPcdsDesabilitadaHidro').html('<b>'+data.hidro[0][3]+'</b>');                          
            $('#outPut-totalPcdsHidro').html('<b>'+data.hidro[0][4]+'</b>');
            
            $('#alertaRedeHidro').html(+alertaRedeHidro.toPrecision(3));
            $('#porcentagem-inativas-hidro').html(alertaRedeHidro.toPrecision(3)+'%');            
            $('#porcentagem-ativasHidro').html(porcentagemAtivasHidro.toPrecision(3)+'%');
            $('#porcentagem-suspeitasHidro').html(porcentagemSuspeitasHidro.toPrecision(3)+'%');
            $('#porcentagem-desabilitadasHidro').html(porcentagemDesabilitadasHidro.toPrecision(3)+'%');
            
            if (alertaRedeHidro >= 50 && alertaRedeHidro <= 70) {
                redHidro.className = 'red-alertHidro red-alert-hidro-invisible';
                yellowHidro.className = 'yellow-alertHidro yellow-alert-hidro';
                $(yellowHidro).tooltip({placement: "bottom" ,title: "Inatividade Hidro - "+alertaRedeHidro.toPrecision(3)+"%"});
            } else if (alertaRedeHidro > 70) {
                yellowHidro.className = 'yellow-alertHidro yellow-alert-hidro-invisible';
                redHidro.className = 'red-alertHidro red-alert-Hidro';
                $(redHidro).tooltip({placement: "bottom" ,title: "Inatividade Hidro  - "+alertaRedeHidro.toPrecision(3)+"%"});
            }
            /*HIDRO*/
            
            /*AGRO*/
            var redAgro = document.getElementById('red-alerta-agro');
            var yellowAgro = document.getElementById('yellow-alerta-agro');
            porcentagemAtivasAgro = data.agro[0][0] * 100 / data.agro[0][4];            
            porcentagemSuspeitasAgro = data.agro[0][1] * 100 / data.agro[0][4];
            porcentagemDesabilitadasAgro = data.agro[0][3] * 100 / data.agro[0][4];           
            $('#outPut-totalPcdsOperacionalAgro').html('<b>'+data.agro[0][0]+'</b>');
            $('#outPut-totalPcdsSuspeitasAgro').html('<b>'+data.agro[0][1]+'</b>');
            $('#outPut-totalPcdsInativasAgro').html('<b>'+data.agro[0][2]+'</b>');
            $('#outPut-totalPcdsDesabilitadaAgro').html('<b>'+data.agro[0][3]+'</b>');                           
            $('#outPut-totalPcdsAgro').html('<b>'+data.agro[0][4]+'</b>');
            
            $('#alertaRedeAgro').html(+alertaRedeAgro.toPrecision(3));
            $('#porcentagem-inativas-agro').html(alertaRedeAgro.toPrecision(3)+'%');            
            $('#porcentagem-ativasAgro').html(porcentagemAtivasAgro.toPrecision(3)+'%');
            $('#porcentagem-suspeitasAgro').html(porcentagemSuspeitasAgro.toPrecision(3)+'%');
            $('#porcentagem-desabilitadasAgro').html(porcentagemDesabilitadasAgro.toPrecision(3)+'%');
            
            if (alertaRedeAgro >= 50 && alertaRedeAgro <= 70) {
                redAgro.className = 'red-alertAgro red-alert-agro-invisible';
                yellowAgro.className = 'yellow-alertAgro yellow-alert-agro';
                $(yellowAgro).tooltip({placement: "bottom" ,title: "Inatividade Agro - "+alertaRedeAgro.toPrecision(3)+"%"});
            } else if (alertaRedeAgro > 70) {
                yellowAgro.className = 'yellow-alertAgro yellow-alert-agro-invisible';
                redAgro.className = 'red-alertAgro red-alert-agro';
                $(redAgro).tooltip({placement: "bottom" ,title: "Inatividade Agro  - "+alertaRedeAgro.toPrecision(3)+"%"});
            }
            /*AGRO*/                        
            
            /*GEO*/
            var redGeo = document.getElementById('red-alerta-geo');
            var yellowGeo = document.getElementById('yellow-alerta-geo');
            porcentagemAtivasGeo = data.geo[0][0] * 100 / data.geo[0][4];            
            porcentagemSuspeitasGeo = data.geo[0][1] * 100 / data.geo[0][4];
            porcentagemDesabilitadasGeo = data.geo[0][3] * 100 / data.geo[0][4];            
            $('#outPut-totalPcdsOperacionalGeo').html('<b>'+data.geo[0][0]+'</b>');
            $('#outPut-totalPcdsSuspeitasGeo').html('<b>'+data.geo[0][1]+'</b>');
            $('#outPut-totalPcdsInativasGeo').html('<b>'+data.geo[0][2]+'</b>');
            $('#outPut-totalPcdsDesabilitadaGeo').html('<b>'+data.geo[0][3]+'</b>');                                       
            $('#outPut-totalPcdsGeo').html('<b>'+data.geo[0][4]+'</b>');                         
            
            $('#alertaRedeGeo').html(alertaRedeGeo.toPrecision(3));
            $('#porcentagem-inativas-geo').html(alertaRedeGeo.toPrecision(3)+'%');            
            $('#porcentagem-ativasGeo').html(porcentagemAtivasGeo.toPrecision(3)+'%');
            $('#porcentagem-suspeitasGeo').html(porcentagemSuspeitasGeo.toPrecision(3)+'%');
            $('#porcentagem-desabilitadasGeo').html(porcentagemDesabilitadasGeo.toPrecision(3)+'%');
            
            if (alertaRedeGeo >= 50 && alertaRedeGeo <= 70) {
                redGeo.className = 'red-alertGeo red-alert-geo-invisible';
                yellowGeo.className = 'yellow-alertGeo yellow-alert-geo';
                $(yellowGeo).tooltip({placement: "bottom" ,title: "Inatividade Geo - "+alertaRedeGeo.toPrecision(3)+"%"});
            } else if (alertaRedeGeo > 70) {
                yellowGeo.className = 'yellow-alertGeo yellow-alert-geo-invisible';
                redGeo.className = 'red-alertGeo red-alert-geo';
                $(redGeo).tooltip({placement: "bottom" ,title: "Inatividade Geo  - "+alertaRedeGeo.toPrecision(3)+"%"});
            }
            /*GEO*/
                        
            operacional = data.totalPcds[0][0];
            suspeitas = data.totalPcds[0][1];
            inativas = data.totalPcds[0][2];
            desabilitadas = data.totalPcds[0][3];
            graficoPieQuadroGeral(operacional, inativas, suspeitas, desabilitadas);             
        }
    }); 
}

//function printTable(data){//Iprime tabela com valores de forma dinamica
//    var dados = [], pcds = ["pluvio","acqua","hidro","agro","geo","totalPcds"]; 
//    operadora = ["Sem Chip","Oi","Vivo","Claro","Tim","TotalPcds"];
//    $('#dadosTableBody').empty();
//    for (j = 0; j < operadora.length; j++){        
//        tipoPcd = pcds[j];
//        dados = data[tipoPcd];        
//        var row = document.createElement("tr");
//        var rowText = document.createTextNode("" + pcds[j] + "");                        
//        row.appendChild(rowText);
//        for(var i = 0; i < dados.length; i++) {
//            var cell = document.createElement("td");
//             var cellText = null;
//            if(dados[i][1] === null){
//                cellText = document.createTextNode(""+dados[i][0]+"");            
//            }else{
//                cellText = document.createTextNode(""+dados[i][0]+"");            
//            }
//            cell.appendChild(cellText);
//            row.appendChild(cell);             
//        }
//         $('#dadosTableBody').append(row);
//    }
//}
   
//Retorna Json com os chips inativos por operadora
function getChipOperadoraInativas() {
    $.ajax({
        async: true,
        global: false,
//        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonQtdPcdsInativasbyOperadora", //desk cemaden
        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonQtdPcdsInativasbyOperadora", // meu desk
////        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonQtdPcdsInativasbyOperadora", //
        dataType: "json",
        cache: false,
        crossDomain: true,
        success: function (data) {
//            printTable(data); 
            
            claro = data.totalPcds[0][0];
            oi = data.totalPcds[1][0];
            tim = data.totalPcds[2][0];
            vivo = data.totalPcds[3][0];
            sem_chip = data.totalPcds[4][0];
            graficoPieQuadroGeralOperadoras(claro, oi, tim, vivo, sem_chip);
        }
    });
}

function updateValoresTotais() {
    $.ajax({
        async: true,
        global: false,
//        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",/*local cemaden*/
        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",/*meu desk*/
//        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",
        dataType: "json",
        cache: false,
        crossDomain: false,
        success: function (data) {
            $('#outPut-OperacionalGeral').html('<b>' + data.totalPcds[0][0] + '</b>');
            $('#outPut-SuspeitasGeral').html('<b>' + data.totalPcds[0][1] + '</b>');
            $('#outPut-InativasGeral').html('<b>' + data.totalPcds[0][2] + '</b>');
            $('#outPut-DesabilitadasGeral').html('<b>' + data.totalPcds[0][3] + '</b>');
        }
    });
}

function updateValoresTotaisPluvio() {
    $.ajax({
        async: true,
        global: false,
//        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",/*local cemaden*/
        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",/*meu desk*/
//        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",
        dataType: "json",
        cache: false,
        crossDomain: false,
        success: function (data) {
           $('#outPut-OperacionalGeralPluvio').html('<b>'+data.pluvio[0][0]+'</b>');
            $('#outPut-SuspeitasGeralPluvio').html('<b>'+data.pluvio[0][1]+'</b>');
            $('#outPut-InativasGeralPluvio').html('<b>'+data.pluvio[0][2]+'</b>');
            $('#outPut-DesabilitadasGeralPluvio').html('<b>'+data.pluvio[0][3]+'</b>');
        }
    });
}

function updateValoresTotaisAcqua(){
     $.ajax({
        async: true,
        global: false,        
//        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",/*local cemaden*/
        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",/*meu desk*/
//        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",
        dataType: "json",
        cache: false,
        crossDomain: false,
        success: function (data) {            
            $('#outPut-OperacionalGeralAcqua').html('<b>'+data.acqua[0][0]+'</b>');
            $('#outPut-SuspeitasGeralAcqua').html('<b>'+data.acqua[0][1]+'</b>');
            $('#outPut-InativasGeralAcqua').html('<b>'+data.acqua[0][2]+'</b>');
            $('#outPut-DesabilitadasGeralAcqua').html('<b>'+data.acqua[0][3]+'</b>');                                         
        }         
     });

}

function updateValoresTotaisHidro() {
    $.ajax({
        async: true,
        global: false,
//        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",/*local cemaden*/
        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",/*meu desk*/
//        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",
        dataType: "json",
        cache: false,
        crossDomain: false,
        success: function (data) {
            $('#outPut-OperacionalGeralHidro').html('<b>'+data.hidro[0][0]+'</b>');
            $('#outPut-SuspeitasGeralHidro').html('<b>'+data.hidro[0][1]+'</b>');
            $('#outPut-InativasGeralHidro').html('<b>'+data.hidro[0][2]+'</b>');
            $('#outPut-DesabilitadasGeralHidro').html('<b>'+data.hidro[0][3]+'</b>');
        }
    });
}

function updateValoresTotaisAgro() {
    $.ajax({
        async: true,
        global: false,
//        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",/*local cemaden*/
        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",/*meu desk*/
//        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",
        dataType: "json",
        cache: false,
        crossDomain: false,
        success: function (data) {
            $('#outPut-OperacionalGeralAgro').html('<b>'+data.agro[0][0]+'</b>');
            $('#outPut-SuspeitasGeralAgro').html('<b>'+data.agro[0][1]+'</b>');
            $('#outPut-InativasGeralAgro').html('<b>'+data.agro[0][2]+'</b>');
            $('#outPut-DesabilitadasGeralAgro').html('<b>'+data.agro[0][3]+'</b>');
        }
    });
}

function updateValoresTotaisGeo() {
    $.ajax({
        async: true,
        global: false,
//        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",/*local cemaden*/
        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",/*meu desk*/
//        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonTotalPcdsQuadroGeralRede",
        dataType: "json",
        cache: false,
        crossDomain: false,
        success: function (data) {
            $('#outPut-OperacionalGeralGeo').html('<b>'+data.geo[0][0]+'</b>');
            $('#outPut-SuspeitasGeralGeo').html('<b>'+data.geo[0][1]+'</b>');
            $('#outPut-InativasGeralGeo').html('<b>'+data.geo[0][2]+'</b>');            
            $('#outPut-DesabilitadasGeralGeo').html('<b>'+data.geo[0][3]+'</b>'); 
        }
    });
}

/*============================================================================*/
/*grafico de pizza quadro geral - status geral da rede*/
function graficoPieQuadroGeral(operacional, inativas, suspeitas, desabilitadas) {
    Highcharts.chart('container-status', {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Status Geral'
        },
        colors: ['#5c5c61', '#f25e59', '#f7b354', '#64e572'], /*ordem das cores - [suspeita, inativa, desabilitada, operacional]*/
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
                name: 'Status',
                data: [{
                        name: 'Desabilitada',
                        y: desabilitadas
                    }, {
                        name: 'Inativa',
                        y: inativas
                    }, {
                        name: 'Suspeita',
                        y: suspeitas
                    }, {
                        name: 'Operacional',
                        y: operacional
                    }]
            }]
    });
}


//grafico pizza status inatividades operadoras nas ultimas 24 horas
function graficoPieQuadroGeralOperadoras(claro, oi, tim, vivo, semOperadora) {
    Highcharts.chart('container-operadoras', {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Inatividade Chips - Últimas 24h'
        },
        colors: ['#69248a', '#0829cf', '#f28900', '#ff0000','#424040'], /*ordem das cores - [vivo, tim, oi, claro, sem chip definido]*/
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
                name: 'Status',
                data: [{
                        name: 'Vivo',
                        y: vivo
                    }, {
                        name: 'Tim',
                        y: tim
                    }, {
                        name: 'Oi',
                        y: oi
                    }, {
                        name: 'Claro',
                        y: claro
                    },{
                        name: 'Sem Chip definido',
                        y: semOperadora
                    }]
            }]
    });
}

function lastUpdate(){
    var date = new Date();
    $('#outPut-lastUpdate').html(date.toLocaleString('pt-BR'));
}

function updateCarousel() {
    var barInterval = setInterval(progressBarCarousel, 100);
    var percent = 0, bar = $('.transition-timer-carousel-progress-bar'), crsl = $('#myCarousel-pagina-completa');
    
    function progressBarCarousel() {
        bar.css({width: percent + '%'});
        percent = percent + 0.1;
        if (percent > 100) {
            percent = 0;
            crsl.carousel('next');
        }
    }
    crsl.carousel({interval: false, pause: true, wrap: false}).on('slid.bs.carousel', function () {          
        if($('#pagina-0').hasClass("active")){
            getTotalPcdsQuadroGeralRede();  
            getChipOperadoraInativas();
            lastUpdate();
        }        
        if($('#pagina-1').hasClass("active")){
            plotarGraficosdeColunas('Geral');
            plotarGraficosdeLinhas('Geral');
            updateValoresTotais();
            getStatusPcdsQuadroGeralMaps();
        }        
        if($('#pagina-2').hasClass("active")){
            plotarGraficosdeColunas('Pluvio');
            plotarGraficosdeLinhas('Pluvio');
            updateValoresTotaisPluvio();
            getStatusPcdsPluvioMap();
            getPcdsInativasOperadorasPluvio();
        }        
        if($('#pagina-3').hasClass("active")){
            plotarGraficosdeColunas('Acqua');
            plotarGraficosdeLinhas('Acqua');
            updateValoresTotaisAcqua();
            getStatusPcdsAcquaMap();
            getPcdsInativasOperadorasAcqua();
        }        
        if($('#pagina-4').hasClass("active")){
            plotarGraficosdeColunas('Agro');
            plotarGraficosdeLinhas('Agro');
            updateValoresTotaisAgro();
            getStatusPcdsAgroMap();
            getPcdsInativasOperadorasAgro();
        }        
        if($('#pagina-5').hasClass("active")){            
            plotarGraficosdeColunas('Hidro');
            plotarGraficosdeLinhas('Hidro');                        
            updateValoresTotaisHidro();           
            getStatusPcdsHidroMap();
            getPcdsInativasOperadorasHidro();
        }        
        if($('#pagina-6').hasClass("active")){
            plotarGraficosdeColunas('Geo');
            plotarGraficosdeLinhas('Geo');
            updateValoresTotaisGeo();
            getStatusPcdsGeoMap();
            getPcdsInativasOperadorasGeo();           
        }
    });
    crsl.hover(
            function () {
                clearInterval(barInterval);
            },
            function () {
                barInterval = setInterval(progressBarCarousel, 100);
            }
    );
}

function gotoSlide(number){
   $("#myCarousel-pagina-completa").carousel(number);   
}

$(document).ready(function(){
  getTotalPcdsQuadroGeralRede();
  getChipOperadoraInativas();
  updateCarousel();
  lastUpdate();
    window.onload = function () {
        setTimeout('location.reload();', 900000);
    };
});

    