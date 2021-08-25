/* global Highcharts, chrome */

/**
 * @author Marcus Costa
 * @ Data: 06/12/2018
 * */
/*============================================================================*/
/*carrega os dados do arquivo json no grafico de coluna*/

//$(function () { 
function plotarGraficosdeColunas(estacao) {
    $.ajax({
        async: true,
        global: false,
        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonRedePcdsUF",/*local cemaden*/
//        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonRedePcdsUF",/*meu desk*/
//        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonRedePcdsUF",
        dataType: "json",
        cache: false,
        crossDomain: true,
        success: function (data) {
            var operacionalGeral = [], inativasGeral = [], suspeitasGeral = [], desabilitadasGeral = [], ufsGeral = [], arrayHidro = [];
            var operacionalPluvio = [], inativasPluvio = [], suspeitasPluvio = [], desabilitadasPluvio = [], ufsPluvio = [], arrayAcqua = [];
            var operacionalAcqua = [], inativasAcqua = [], suspeitasAcqua = [], desabilitadasAcqua = [], ufsAcqua = [], arrayAcqua = [];
            var operacionalHidro = [], inativasHidro = [], suspeitasHidro = [], desabilitadasHidro = [], ufsHidro = [], arrayHidro = [];
            var operacionalAgro = [], inativasAgro = [], suspeitasAgro = [], desabilitadasAgro = [], ufsAgro = [], arrayAgro = [];
            var operacionalGeo = [], inativasGeo = [], suspeitasGeo = [], desabilitadasGeo = [], ufsGeo = [], arrayGeo = [];
            arrayGeral = data.totalPcds, arrayPluvio = data.pluvio, arrayAcqua = data.acqua, arrayHidro = data.hidro, arrayAgro = data.agro, arrayGeo = data.geo;

            if (estacao === 'Geral') {
                for (a = 0; a < arrayGeral.length; a++) {
                    var o = {}, i = {}, s = {}, d = {}, uf = {};
                    d = arrayGeral[a][4];
                    i = arrayGeral[a][3];
                    s = arrayGeral[a][2];
                    o = arrayGeral[a][1];
                    uf = arrayGeral[a][0];
                    desabilitadasGeral.push(d);
                    inativasGeral.push(i);
                    suspeitasGeral.push(s);
                    operacionalGeral.push(o);
                    ufsGeral.push(uf);
                }
                graficoQuadroGeral(operacionalGeral, inativasGeral, suspeitasGeral, desabilitadasGeral, ufsGeral);
            }

            if (estacao === 'Pluvio') {
                for (a = 0; a < arrayPluvio.length; a++) {
                    var opluvio = {}, ipluvio = {}, spluvio = {}, dpluvio = {}, ufpluvio = {};
                    dpluvio = arrayPluvio[a][4];
                    ipluvio = arrayPluvio[a][3];
                    spluvio = arrayPluvio[a][2];
                    opluvio = arrayPluvio[a][1];
                    ufpluvio = arrayPluvio[a][0];
                    desabilitadasPluvio.push(dpluvio);
                    inativasPluvio.push(ipluvio);
                    suspeitasPluvio.push(spluvio);
                    operacionalPluvio.push(opluvio);
                    ufsPluvio.push(ufpluvio);
                }
                graficoPluviometrica(operacionalPluvio, inativasPluvio, suspeitasPluvio, desabilitadasPluvio, ufsPluvio);
            }

            if (estacao === 'Acqua') {
                for (a = 0; a < arrayAcqua.length; a++) {
                    var oAcqua = {}, iAcqua = {}, sAcqua = {}, dAcqua = {}, ufAcqua = {};
                    dAcqua = arrayAcqua[a][4];
                    iAcqua = arrayAcqua[a][3];
                    sAcqua = arrayAcqua[a][2];
                    oAcqua = arrayAcqua[a][1];
                    ufAcqua = arrayAcqua[a][0];
                    desabilitadasAcqua.push(dAcqua);
                    inativasAcqua.push(iAcqua);
                    suspeitasAcqua.push(sAcqua);
                    operacionalAcqua.push(oAcqua);
                    ufsAcqua.push(ufAcqua);
                }
                graficoAcqua(operacionalAcqua, inativasAcqua, suspeitasAcqua, desabilitadasAcqua, ufsAcqua);
            }

            if (estacao === 'Hidro') {
                for (a = 0; a < arrayHidro.length; a++) {
                    var oHidro = {}, iHidro = {}, sHidro = {}, dHidro = {}, ufHidro = {};
                    dHidro = arrayHidro[a][4];
                    iHidro = arrayHidro[a][3];
                    sHidro = arrayHidro[a][2];
                    oHidro = arrayHidro[a][1];
                    ufHidro = arrayHidro[a][0];
                    desabilitadasHidro.push(dHidro);
                    inativasHidro.push(iHidro);
                    suspeitasHidro.push(sHidro);
                    operacionalHidro.push(oHidro);
                    ufsHidro.push(ufHidro);
                }
                graficoHidrologica(operacionalHidro, inativasHidro, suspeitasHidro, desabilitadasHidro, ufsHidro);
            }
            if (estacao === 'Agro') {
                for (a = 0; a < arrayAgro.length; a++) {
                    var oAgro = {}, iAgro = {}, sAgro = {}, dAgro = {}, ufAgro = {};
                    dAgro = arrayAgro[a][4];
                    iAgro = arrayAgro[a][3];
                    sAgro = arrayAgro[a][2];
                    oAgro = arrayAgro[a][1];
                    ufAgro = arrayAgro[a][0];
                    desabilitadasAgro.push(dAgro);
                    inativasAgro.push(iAgro);
                    suspeitasAgro.push(sAgro);
                    operacionalAgro.push(oAgro);
                    ufsAgro.push(ufAgro);
                }
                graficoAgro(operacionalAgro, inativasAgro, suspeitasAgro, desabilitadasAgro, ufsAgro);
            }

            if (estacao === 'Geo') {
                for (a = 0; a < arrayGeo.length; a++) {
                    var oGeo = {}, iGeo = {}, sGeo = {}, dGeo = {}, ufGeo = {};
                    dGeo = arrayGeo[a][4];
                    iGeo = arrayGeo[a][3];
                    sGeo = arrayGeo[a][2];
                    oGeo = arrayGeo[a][1];
                    ufGeo = arrayGeo[a][0];
                    desabilitadasGeo.push(dGeo);
                    inativasGeo.push(iGeo);
                    suspeitasGeo.push(sGeo);
                    operacionalGeo.push(oGeo);
                    ufsGeo.push(ufGeo);
                }
                graficoGeo(operacionalGeo, inativasGeo, suspeitasGeo, desabilitadasGeo, ufsGeo);
            }
        }
    });
}

/*carrega os dados do arquivo json no grafico de linhas -  inatividade das pcds*/
function plotarGraficosdeLinhas(estacao) {
//$(function () {
    $.ajax({
        async: true,
        global: false,
        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonInatividadePcds",/*local cemaden*/
//        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonInatividadePcds",/*meu desk*/
//        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonInatividadePcds",
        dataType: "json",
        cache: false,
        crossDomain: true,
        success: function (data) {           
            var dadosGeralInativas = [], arrayGeralInativas = [], dadosPluvioInativas = [], arrayPluvioInativas = [],
                    dadosAcquaInativas = [], arrayAcquaInativas = [], dadosHidroInativas = [], arrayHidroInativas = [],
                    dadosAgroInativas = [], arrayAgroInativas = [], dadosGeoInativas = [], arrayGeoInativas = [];

                    
            arrayGeralInativas = data.totalPcds;
            arrayPluvioInativas = data.pluvio;
            arrayAcquaInativas = data.acqua;
            arrayHidroInativas = data.hidro;
            arrayAgroInativas = data.agro;
            arrayGeoInativas = data.geo;
           

            if (estacao === 'Geral') {
                for (a = 0; a < arrayGeralInativas.length; a++) {
                    var itemGeral = {};
                    if (a !== arrayGeralInativas.length - 1) {
                        itemGeral.y = arrayGeralInativas[a][1];
                        itemGeral.x = new Date(arrayGeralInativas[a][0]).getTime();
                    } else {
                        itemGeral.y = (arrayGeralInativas[a]['qtdInativa']);
                        itemGeral.x = new Date(arrayGeralInativas[a]['datahora']).getTime();
                    }
                    dadosGeralInativas.push(itemGeral);
                }
                graficoGeralInatividade(dadosGeralInativas);
            }

            if (estacao === 'Pluvio') {
                for (a = 0; a < arrayPluvioInativas.length; a++) {
                    var itemPluvio = {};
                    if (a !== arrayPluvioInativas.length - 1) {
                        itemPluvio.y = arrayPluvioInativas[a][1];
                        itemPluvio.x = new Date(arrayPluvioInativas[a][0]).getTime();
                    } else {
                        itemPluvio.y = (arrayPluvioInativas[a]['qtdInativa']);
                        itemPluvio.x = new Date(arrayPluvioInativas[a]['datahora']).getTime();
                    }
                    dadosPluvioInativas.push(itemPluvio);
                }
                graficoPluvioInatividade(dadosPluvioInativas);
            }

            if (estacao === 'Acqua') {
                for (a = 0; a < arrayAcquaInativas.length; a++) {
                    var itemAcqua = {};
                    if (a !== arrayAcquaInativas.length - 1) {
                        itemAcqua.y = arrayAcquaInativas[a][1];
                        itemAcqua.x = new Date(arrayAcquaInativas[a][0]).getTime();
                    } else {
                        itemAcqua.y = (arrayAcquaInativas[a]['qtdInativa']);
                        itemAcqua.x = new Date(arrayAcquaInativas[a]['datahora']).getTime();
                    }
                    dadosAcquaInativas.push(itemAcqua);
                }
                graficoAcquaInatividade(dadosAcquaInativas);
            }

            if (estacao === 'Hidro') {
                for (a = 0; a < arrayHidroInativas.length; a++) {
                    var itemHidro = {};
                    if (a !== arrayHidroInativas.length - 1) {
                        itemHidro.y = arrayHidroInativas[a][1];
                        itemHidro.x = new Date(arrayHidroInativas[a][0]).getTime();
                    } else {
                        itemHidro.y = (arrayHidroInativas[a]['qtdInativa']);
                        itemHidro.x = new Date(arrayHidroInativas[a]['datahora']).getTime();
                    }
                    dadosHidroInativas.push(itemHidro);
                }
                graficoHidroInatividade(dadosHidroInativas);
            }

            if (estacao === 'Agro') {
                for (a = 0; a < arrayAgroInativas.length; a++) {
                    var itemAgro = {};
                    if (a !== arrayAgroInativas.length - 1) {
                        itemAgro.y = arrayAgroInativas[a][1];
                        itemAgro.x = new Date(arrayAgroInativas[a][0]).getTime();
                    } else {
                        itemAgro.y = (arrayAgroInativas[a]['qtdInativa']);
                        itemAgro.x = new Date(arrayAgroInativas[a]['datahora']).getTime();
                    }
                    dadosAgroInativas.push(itemAgro);
                }
                graficoAgroInatividade(dadosAgroInativas);
            }

            if (estacao === 'Geo') {
                for (a = 0; a < arrayGeoInativas.length; a++) {
                    var itemGeo = {};
                    if (a !== arrayGeoInativas.length - 1) {
                        itemGeo.y = arrayGeoInativas[a][1];
                        itemGeo.x = new Date(arrayGeoInativas[a][0]).getTime();
                    } else {
                        itemGeo.y = (arrayGeoInativas[a]['qtdInativa']);
                        itemGeo.x = new Date(arrayGeoInativas[a]['datahora']).getTime();
                        
                    }                                                            
                    dadosGeoInativas.push(itemGeo);                   
                }
                graficoGeoInatividade(dadosGeoInativas);
            }
        }
    });
}

/*===========================inicio dos graficos================================*/

/*grafico de colunas - quadro geral*/
function graficoQuadroGeral(operacional, inativas, suspeitas, desabilitadas, ufs) {
    Highcharts.chart('table-container', {
        chart: {
            type: 'column',
            reflow: true
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        yAxis: {
            min: 0,
            allowDecimals: false,
            title: {
                text: '% Pcds'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            }
        },
        xAxis: {
            type: 'category',
            categories: ufs
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'top',
            x: 0,
            y: 25,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            formatter: function () {

                var s = '<b>' + this.x + '</b>', total = 0;

                $.each(this.points, function (i, point) {
                    s += '<br/>' + point.series.name + ': ' + point.y;
                    total += point.y;
                });

                s += '<br/>Total Pcds: ' + total;
                return s;
            },
//            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>({point.percentage:.0f}%)<br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'percent',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    format: '{point.percentage:.1f}%',
                    style: {
                        textShadow: '0 0 2px black, 0 0 2px black'
                    }
                }
            }
        },
        series: [{
                name: 'Desabilitada',
                color: '#5c5c61',
                legendIndex: 3,
                data: desabilitadas

            }, {
                name: 'Inativa',
                color: '#f25e59',
                legendIndex: 2,
                data: inativas
            }, {
                name: 'Suspeita',
                color: '#f7b354',
                legendIndex: 1,
                data: suspeitas
            }, {
                name: 'Operacional',
                color: '#64e572',
                legendIndex: 0,
                data: operacional
            }]
    });
}

/*grafico linha inatividade quadro geral*/
function graficoGeralInatividade(dados) {
    Highcharts.chart('table-container-disponibilidade-rede', {
        series: [{
                data: dados
            }],
        chart: {
            type: 'line',
            reflow: true
        },
        title: {
            text: 'Inatividade da Rede SGRP/Salvar'
        },
        subtitle: {
            text: null
        },
        xAxis: {
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000,
            dateTimeLabelFormats: {
                day: "%e-%b"
            }
        },
        yAxis: {
            allowDecimals: false,
            title: {
                text: 'Qtd Pcds'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true,
                allowPointSelect: true
            },
            series: {
                pointIntervalUnit: 'day',
                lineColor: '#000000',
                marker: {
                    fillColor: '#FFFFFF',
                    lineWidth: 2,
                    lineColor: '#000000',
                    enabled: false
                }
            }
        },
        tooltip: {
            shared: true,
            crosshairs: true,
            xDateFormat: '%d/%m/%Y - %Hh'
        }

    });
}

/*grafico de colunas rede pluvio - total/uf*/
function graficoPluviometrica(operacional, inativas, suspeitas, desabilitadas, ufs) {
    Highcharts.chart('table-container-rede-pluvio', {
        chart: {
            type: 'column',
            reflow: true
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        yAxis: {
            min: 0,
            allowDecimals: false,
            title: {
                text: '% Pcds'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            }
        },
        xAxis: {
            type: 'category',
            categories: ufs
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'top',
            x: 0,
            y: 25,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            formatter: function () {

                var s = '<b>' + this.x + '</b>', total = 0;

                $.each(this.points, function (i, point) {
                    s += '<br/>' + point.series.name + ': ' + point.y;
                    total += point.y;
                });

                s += '<br/>Total Pcds: ' + total;
                return s;
            },
//            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>({point.percentage:.0f}%)<br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'percent',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    format: '{point.percentage:.1f}%',
                    style: {
                        textShadow: '0 0 2px black, 0 0 2px black'
                    }
                }
            }
        },
        series: [{
                name: 'Desabilitada',
                color: '#5c5c61',
                legendIndex: 3,
                data: desabilitadas

            }, {
                name: 'Inativa',
                color: '#f25e59',
                legendIndex: 2,
                data: inativas
            }, {
                name: 'Suspeita',
                color: '#f7b354',
                legendIndex: 1,
                data: suspeitas
            }, {
                name: 'Operacional',
                color: '#64e572',
                legendIndex: 0,
                data: operacional
            }]
    });
}

/*grafico linhas inatividade pcds rede pluvio*/
function graficoPluvioInatividade(dados) {
    Highcharts.chart('table-container-inatividade-rede-pluvio', {
        series: [{
                name: 'Qtd Pcds',
                data: dados
            }],
        chart: {
            type: 'line',
            reflow: true
        },
        title: {
            text: 'Inatividade da Rede Pluviométrica'
        },
        subtitle: {
            text: null
        },
        xAxis: {
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000,
            dateTimeLabelFormats: {
                day: "%e-%b"
            }
        },
        yAxis: {
            allowDecimals: false,
            title: {
                text: 'Qtd Pcds'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true,
                allowPointSelect: true
            },
            series: {
                pointIntervalUnit: 'day',
                lineColor: '#000000',
                marker: {
                    fillColor: '#FFFFFF',
                    lineWidth: 2,
                    lineColor: '#000000',
                    enabled: false
                }
            }
        },
        tooltip: {
            shared: true,
            crosshairs: true,
            xDateFormat: '%d/%m/%Y - %Hh'
        }
    });
}


/*grafico de colunas rede acqua - total/uf*/
function graficoAcqua(operacional, inativas, suspeitas, desabilitadas, ufs) {
    Highcharts.chart('table-container-rede-acqua', {
        chart: {
            type: 'column',
            reflow: true
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        yAxis: {
            min: 0,
            allowDecimals: false,
            title: {
                text: '% Pcds'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            }
        },
        xAxis: {
            type: 'category',
            categories: ufs
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'top',
            x: 0,
            y: 25,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            formatter: function () {

                var s = '<b>' + this.x + '</b>', total = 0;

                $.each(this.points, function (i, point) {
                    s += '<br/>' + point.series.name + ': ' + point.y;
                    total += point.y;
                });

                s += '<br/>Total Pcds: ' + total;
                return s;
            },
//            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>({point.percentage:.0f}%)<br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'percent',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    format: '{point.percentage:.1f}%',
                    style: {
                        textShadow: '0 0 2px black, 0 0 2px black'
                    }
                }
            }
        },
        series: [{
                name: 'Desabilitada',
                color: '#5c5c61',
                legendIndex: 3,
                data: desabilitadas

            }, {
                name: 'Inativa',
                color: '#f25e59',
                legendIndex: 2,
                data: inativas
            }, {
                name: 'Suspeita',
                color: '#f7b354',
                legendIndex: 1,
                data: suspeitas
            }, {
                name: 'Operacional',
                color: '#64e572',
                legendIndex: 0,
                data: operacional
            }]
    });
}

/*grafico linhas inatividade pcds rede acqua*/
function graficoAcquaInatividade(dados) {
    Highcharts.chart('table-container-inatividade-rede-acqua', {
        series: [{
                name: 'Qtd Pcds',
                data: dados
            }],
        chart: {
            type: 'line',
            reflow: true
        },
        title: {
            text: 'Inatividade da Rede Acqua'
        },
        subtitle: {
            text: null
        },
        xAxis: {
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000,
            dateTimeLabelFormats: {
                day: "%e-%b"
            }
        },
        yAxis: {
            allowDecimals: false,
            title: {
                text: 'Qtd Pcds'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true,
                allowPointSelect: true
            },
            series: {
                pointIntervalUnit: 'day',
                lineColor: '#000000',
                marker: {
                    fillColor: '#FFFFFF',
                    lineWidth: 2,
                    lineColor: '#000000',
                    enabled: false
                }
            }
        },
        tooltip: {
            shared: true,
            crosshairs: true,
            xDateFormat: '%d/%m/%Y - %Hh'
        }

    });
}

/*grafico de colunas rede hidro - total/uf*/
function graficoHidrologica(operacional, inativas, suspeitas, desabilitadas, ufs) {
    Highcharts.chart('table-container-rede-hidro', {
        chart: {
            type: 'column',
            reflow: true
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        yAxis: {
            min: 0,
            allowDecimals: false,
            title: {
                text: '% Pcds'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            }
        },
        xAxis: {
            type: 'category',
            categories: ufs
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'top',
            x: 0,
            y: 25,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            formatter: function () {

                var s = '<b>' + this.x + '</b>', total = 0;

                $.each(this.points, function (i, point) {
                    s += '<br/>' + point.series.name + ': ' + point.y;
                    total += point.y;
                });

                s += '<br/>Total Pcds: ' + total;
                return s;
            },
//            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>({point.percentage:.0f}%)<br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'percent',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    format: '{point.percentage:.1f}%',
                    style: {
                        textShadow: '0 0 2px black, 0 0 2px black'
                    }
                }
            }
        },
        series: [{
                name: 'Desabilitada',
                color: '#5c5c61',
                legendIndex: 3,
                data: desabilitadas

            }, {
                name: 'Inativa',
                color: '#f25e59',
                legendIndex: 2,
                data: inativas
            }, {
                name: 'Suspeita',
                color: '#f7b354',
                legendIndex: 1,
                data: suspeitas
            }, {
                name: 'Operacional',
                color: '#64e572',
                legendIndex: 0,
                data: operacional
            }]
    });
}

/*grafico linhas inatividade pcds rede hidro*/
function graficoHidroInatividade(dados) {
    Highcharts.chart('table-container-inatividade-rede-hidro', {
        series: [{
                name: 'Qtd Pcds',
                data: dados
            }],
        chart: {
            type: 'line',
            reflow: true
        },
        title: {
            text: 'Inatividade da Rede Hidrológica'
        },
        subtitle: {
            text: null
        },
        xAxis: {
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000,
            dateTimeLabelFormats: {
                day: "%e-%b"
            }
        },
        yAxis: {
            allowDecimals: false,
            title: {
                text: 'Qtd Pcds'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true,
                allowPointSelect: true
            },
            series: {
                pointIntervalUnit: 'day',
                lineColor: '#000000',
                marker: {
                    fillColor: '#FFFFFF',
                    lineWidth: 2,
                    lineColor: '#000000',
                    enabled: false
                }
            }
        },
        tooltip: {
            shared: true,
            crosshairs: true,
            xDateFormat: '%d/%m/%Y - %Hh'
        }

    });
}

/*grafico de colunas rede agro - total/uf*/
function graficoAgro(operacional, inativas, suspeitas, desabilitadas, ufs) {
    Highcharts.chart('table-container-rede-agro', {
        chart: {
            type: 'column',
            reflow: true
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        yAxis: {
            min: 0,
            allowDecimals: false,
            title: {
                text: '% Pcds'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            }
        },
        xAxis: {
            type: 'category',
            categories: ufs
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'top',
            x: 0,
            y: 25,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            formatter: function () {

                var s = '<b>' + this.x + '</b>', total = 0;

                $.each(this.points, function (i, point) {
                    s += '<br/>' + point.series.name + ': ' + point.y;
                    total += point.y;
                });

                s += '<br/>Total Pcds: ' + total;
                return s;
            },
//            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>({point.percentage:.0f}%)<br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'percent',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    format: '{point.percentage:.1f}%',
                    style: {
                        textShadow: '0 0 2px black, 0 0 2px black'
                    }
                }
            }
        },
        series: [{
                name: 'Desabilitada',
                color: '#5c5c61',
                legendIndex: 3,
                data: desabilitadas

            }, {
                name: 'Inativa',
                color: '#f25e59',
                legendIndex: 2,
                data: inativas
            }, {
                name: 'Suspeita',
                color: '#f7b354',
                legendIndex: 1,
                data: suspeitas
            }, {
                name: 'Operacional',
                color: '#64e572',
                legendIndex: 0,
                data: operacional
            }]
    });
}

/*grafico linhas inatividade pcds rede agro*/
function graficoAgroInatividade(dados) {
    Highcharts.chart('table-container-inatividade-rede-agro', {
        series: [{
                name: 'Qtd Pcds',
                data: dados
            }],
        chart: {
            type: 'line',
            reflow: true
        },
        title: {
            text: 'Inatividade da Rede Agrometeorológica '
        },
        subtitle: {
            text: null
        },
        xAxis: {
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000,
            dateTimeLabelFormats: {
                day: "%e-%b"
            }
        },
        yAxis: {
            allowDecimals: false,
            title: {
                text: 'Qtd Pcds'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true,
                allowPointSelect: true
            },
            series: {
                pointIntervalUnit: 'day',
                lineColor: '#000000',
                marker: {
                    fillColor: '#FFFFFF',
                    lineWidth: 2,
                    lineColor: '#000000',
                    enabled: false
                }
            }
        },
        tooltip: {
            shared: true,
            crosshairs: true,
            xDateFormat: '%d/%m/%Y - %Hh'
        }

    });
}

/*grafico de colunas rede geo - total/uf*/
function graficoGeo(operacional, inativas, suspeitas, desabilitadas, ufs) {
    Highcharts.chart('table-container-rede-geo', {
        chart: {
            type: 'column',
            reflow: true
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        yAxis: {
            min: 0,
            allowDecimals: false,
            title: {
                text: '% Pcds'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            }
        },
        xAxis: {
            type: 'category',
            categories: ufs
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'top',
            x: 0,
            y: 25,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            formatter: function () {

                var s = '<b>' + this.x + '</b>', total = 0;

                $.each(this.points, function (i, point) {
                    s += '<br/>' + point.series.name + ': ' + point.y;
                    total += point.y;
                });

                s += '<br/>Total Pcds: ' + total;
                return s;
            },
//            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>({point.percentage:.0f}%)<br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'percent',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    format: '{point.percentage:.1f}%',
                    style: {
                        textShadow: '0 0 2px black, 0 0 2px black'
                    }
                }
            }
        },
        series: [{
                name: 'Desabilitada',
                color: '#5c5c61',
                legendIndex: 3,
                data: desabilitadas

            }, {
                name: 'Inativa',
                color: '#f25e59',
                legendIndex: 2,
                data: inativas
            }, {
                name: 'Suspeita',
                color: '#f7b354',
                legendIndex: 1,
                data: suspeitas
            }, {
                name: 'Operacional',
                color: '#64e572',
                legendIndex: 0,
                data: operacional
            }]
    });
}

/*grafico linhas inatividade pcds rede geo*/
function graficoGeoInatividade(dados) {
    Highcharts.chart('table-container-inatividade-rede-geo', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Inatividade da Rede Geotécnica'
        },
        subtitle: {
            text: null
        },
        xAxis: {
            crosshair: true,
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000,
            dateTimeLabelFormats: {
                day: "%e-%b"
            }
        },
        yAxis: {
            allowDecimals: false,
            title: {
                text: 'Qtd Pcds'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true,
                    nullFormat: 'N/A'
                },
                enableMouseTracking: true,
                allowPointSelect: true
            },
            series: {
                pointIntervalUnit: 'day',
                lineColor: '#000000',
                marker: {
                    fillColor: '#FFFFFF',
                    lineWidth: 2,
                    lineColor: '#000000',
                    enabled: false
                }
            }
        },
        tooltip: {
            shared: true,
            crosshairs: false,
            xDateFormat: '%d/%m/%Y - %Hh'
        },
        series: [{
                name: 'Pcds Inativas',
                legendIndex: 5,
                data: dados,
                marker: {
                    enabled: false
                }
            }
        ]
    });
}
/*==============================Atualizar=====================================*/
$(document).ready(function () {
    plotarGraficosdeColunas();
    plotarGraficosdeLinhas();
});