/* global ol, popup, view, wmsSourceRiscoHidro, bounds */

/////*================================START MAPS==================================*/
var arrLayersPluvio = [];
// MAPA
arrLayersPluvio[0] = new ol.layer.Tile({
    title: "PCD's Pluviometricas",
//    source: new ol.source.OSM()
    source: new ol.source.XYZ({url: "http://virt142.cemaden.gov.br/osm_tiles/{z}/{x}/{y}.png"})
});

// Estados
arrLayersPluvio[1] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:br_estados', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'brEstados'
});

//área de risco sem indice
arrLayersPluvio[2] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:areasrisco_inov_sem_indice', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'area_risco_sem_indice',
    visible: false
});

/*risco geologico*/
arrLayersPluvio[3] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:movimento_massa_uf', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'risco_geologico',
    visible: false
});

var wmsSourceRiscoHidro = new ol.source.TileWMS({
    url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
    params: {'LAYERS': 'cemaden_dev:risco_hidro_uf', 'TILED': true},
    serverType: 'geoserver'
});

//risco hidro
arrLayersPluvio[4] = new ol.layer.Tile({
    source: wmsSourceRiscoHidro,
    name: 'risco_hidrologico',
    visible: false

//    source: new ol.source.TileWMS({
//        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
//        params: {'LAYERS': 'cemaden_dev:risco_hidro_uf', 'TILED': true},
//        serverType: 'geoserver'
//    })
//    name: 'risco_hidrologico',
//    visible: false
});

///*Construção do mapa*/
var map1 = new ol.Map({
    target: 'map1',
    controls: ol.control.defaults().extend([
//        new ol.control.FullScreen()         
    ]),
    layers: arrLayersPluvio,
    view: new ol.View({
        center: ol.proj.fromLonLat([-55, -10]),
        zoom: 4
    })
});

//onClick
var containerPluvio = document.getElementById('popup');
var contentPluvio = document.getElementById('popup-content');
var closerPluvio = document.getElementById('popup-closer');
var popupPluvio = new ol.Overlay({
    element: containerPluvio,
    positioning: 'bottom-center',
    stopEvent: false,
    autoPan: true,
    offset: [0, -20]
});

map1.addOverlay(popupPluvio);
closerPluvio.onclick = function () {
    popupPluvio.setPosition(undefined);
    closerPluvio.blur();
    return false;
};

map1.on('click', function (evt) {    
    var feature = map1.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });
    if (feature) {
        popupOnHoverPluvio.setPosition(undefined);
        closerHoverPluvio.blur();
        var coordinates = feature.getGeometry().getCoordinates();
        popupPluvio.setPosition(coordinates);        
        var pcd = feature.get('pcd');
        var date = new Date(pcd[8]).toLocaleString('pt-BR');
        var htmlDados = "";
        for (var dado in pcd.dados) {
            htmlDados = htmlDados.concat('<p style="color:#e2d9d9; font-size: small"><strong>IdPcd: </strong>' + pcd.dados[dado].idPcd + ' <br>\n\<br>');
        }
        contentPluvio.innerHTML = '<p style="color:#e2d9d9; font-size: small"><strong>Estacao: </strong>' + pcd[3] + '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Nome: </strong>' + pcd[2] + '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Operadora: </strong>' +pcd[9]+' - '+pcd[10]+ '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Última Conexão: </strong>' + date + '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Dias de Inatividade: </strong>' + qtdDiasInatividade(pcd[8])+ '</p>\n\
                             <p style="color:#e2d9d9; font-size: inherit; text-decoration: underline; font-weight: bold "><a target="_blank" href="http://sjc.salvar.cemaden.gov.br/resources/graficos/interativo/grafico_CEMADEN.php?idpcd='+pcd[1]+'&uf='+pcd[6]+'">Link Mapa Interativo</a></p>\n\
                             </p>' + htmlDados;
    } else {
        popupPluvio.setPosition(undefined);
        closerPluvio.blur();
    }
});
//onClick

//onHover
var containerHoverPluvio = document.getElementById('popup-hover-pluvio');
var closerHoverPluvio = document.getElementById('popup-closer-hover-pluvio');
var hoverInfoPluvio = document.getElementById('infoPcdPluvio');

var popupOnHoverPluvio = new ol.Overlay({
    element: containerHoverPluvio,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -20]
});

map1.addOverlay(popupOnHoverPluvio);
closerHoverPluvio.onclick = function () {
    popupOnHoverPluvio.setPosition(undefined);
    closerHoverPluvio.blur();
    return false;
};

map1.on('pointermove', function (evt) {
    var feature_onHover = map1.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });
    
    if (feature_onHover) {
        var coordinates = feature_onHover.getGeometry().getCoordinates();
        popupOnHoverPluvio.setPosition(coordinates);
        var pcd = feature_onHover.get('pcd');
        var htmlDados = "";
        hoverInfoPluvio.innerHTML = '<p style="color:#e2d9d9; font-size: small; font-weight: bold">'+pcd[3]+' - '+pcd[2]+'</p>\
                                  <p style="color:#e2d9d9; font-size: small; font-weight: bold">'+pcd[7]+' - '+pcd[6]+'</p>\
                                  ' + htmlDados;
    }else {
       popupOnHoverPluvio.setPosition(undefined);
       closerHoverPluvio.blur();
    }
});
//onHover

map1.on('pointermove', function (e) {
    var pixel = map1.getEventPixel(e.originalEvent);
    var hit = map1.hasFeatureAtPixel(pixel);
    var divTarget = document.getElementById(map1.getTarget());
    divTarget.style.cursor = hit ? 'pointer' : '';
});

var legendPluvioA = document.getElementById("inatividade-p0");
var legendPluvioB = document.getElementById("inatividade-p1");
var legendPluvioC = document.getElementById("inatividade-p2");
var legendPluvioD = document.getElementById("inatividade-p3");
var legendPluvioE = document.getElementById("inatividade-p4");
var legendPluvioF = document.getElementById("inatividade-p5");
var legendPluvioG = document.getElementById("inatividade-p6");
var legendPluvioH = document.getElementById("inatividade-p7");

$(document).ready(function () {
    findLayerPluvio("inatividade_pluvio");
    findLayerPluvio("ativa_pluvio");
    findLayerPluvio("suspeita_pluvio");
    findLayerPluvio("desabilitada_pluvio");    
});

function getStatusPcdsPluvioMap(){
     $.ajax({
        async: true,
        global: false,        
        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonStatusPcdsPluvio",/*cemaden local*/
//        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonStatusPcdsPluvio",/*meu desk*/
//        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonStatusPcdsPluvio",
        dataType: "json",
        cache: false,
        crossDomain: true,
        success: function (data) {
            lerArrayPluvioInativas(data.PLUVIO_INATIVA);
            lerArrayPluvioInativasTempo(data.PLUVIO_INATIVA);
            lerArrayPluvioAtivas(data.PLUVIO_ATIVA);
            lerArrayPluvioSuspeitas(data.PLUVIO_SUSPEITA);
            lerArrayPluvioDesabilitadas(data.PLUVIO_DESABILITADA);
            map1.updateSize();
        }
    }); 
}

function getPcdsInativasOperadorasPluvio(){
     $.ajax({
        async: true,
        global: false,        
        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonPcdsInativasOperadora",/*local cemaden*/
//        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonPcdsInativasOperadora",/*meu desk*/
//        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonPcdsInativasOperadora",
        dataType: "json",
        cache: false,
        crossDomain: true,
        success: function (data) {            
            lerArrayPcdsInativasOperadorasPluvio(data.pluvio);            
            map1.updateSize();
        }
    }); 
}

layerPluvioAtivas = new ol.layer.Group({layers: [], visible: false, name: 'ativa_pluvio'});
map1.addLayer(layerPluvioAtivas);
function lerArrayPluvioAtivas(evt) {
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatPluvio(evt[pcd][4], evt[pcd][5]));
        createPinPluvio(layerPluvioAtivas, geom, evt[pcd], '#64e572', "pin_" + pcd);
    }
};

layerPluvioInativas = new ol.layer.Group({layers: [], visible: true, name: 'inatividade_pluvio'});
map1.addLayer(layerPluvioInativas);
function lerArrayPluvioInativas(evt) {    
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatPluvio(evt[pcd][4], evt[pcd][5]));
        createPinPluvio(layerPluvioInativas, geom, evt[pcd], '#f25d59', "pin_" + pcd);
    }
};

layerPluvioSuspeitas = new ol.layer.Group({layers: [], visible: false, name: 'suspeita_pluvio'});
map1.addLayer(layerPluvioSuspeitas);
function lerArrayPluvioSuspeitas(evt) {
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatPluvio(evt[pcd][4], evt[pcd][5]));
        createPinPluvio(layerPluvioSuspeitas, geom, evt[pcd], '#ff9500', "pin_" + pcd);
    }
};

layerPluvioDesabilitada = new ol.layer.Group({layers: [], visible: false, name: 'desabilitada_pluvio'});
map1.addLayer(layerPluvioDesabilitada);
function lerArrayPluvioDesabilitadas(evt) {
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatPluvio(evt[pcd][4], evt[pcd][5]));
        createPinPluvioDesabilitada(layerPluvioDesabilitada, geom, evt[pcd], '#000000', "pin_" + pcd);
    }
};

layerPluvioInativasTempo = new ol.layer.Group({layers: [], visible: false, name: 'inatividade_pluvio_tempo'});     
map1.addLayer(layerPluvioInativasTempo);
function lerArrayPluvioInativasTempo(evt){
    var p1 = 0, p2 = 0,p3 = 0,p4 = 0, p5 = 0, p6 = 0, p7 = 0, p8 = 0;
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatPluvio(evt[pcd][4], evt[pcd][5]));        
        createPinPluvio(layerPluvioInativasTempo, geom, evt[pcd], inatividadeTempo(evt[pcd][8]), "pin_" + pcd);        
        var diasInatividade = qtdDiasInatividade(evt[pcd][8]);       
        if (diasInatividade === 0) {p1 = p1 + 1;}
        if (diasInatividade >= 1 && diasInatividade <= 30) {p2 = p2 + 1;}
        if (diasInatividade >= 31 && diasInatividade <= 60) {p3 = p3 + 1;}
        if (diasInatividade >= 61 && diasInatividade <= 90) {p4 = p4 + 1;}
        if (diasInatividade >= 91 && diasInatividade <= 300) {p5 = p5 + 1;}
        if (diasInatividade >= 301 && diasInatividade <= 600) {p6 = p6 + 1;}
        if (diasInatividade > 600) {p7 = p7 + 1;}
        if (isNaN(diasInatividade)) {p8 = p8 + 1;}        
    }
    legendPluvioA.innerText = legendPluvioA.textContent = '('+p1+')';
    legendPluvioB.innerText = legendPluvioB.textContent = '('+p2+')';
    legendPluvioC.innerText = legendPluvioC.textContent = '('+p3+')';
    legendPluvioD.innerText = legendPluvioD.textContent = '('+p4+')';
    legendPluvioE.innerText = legendPluvioE.textContent = '('+p5+')';
    legendPluvioF.innerText = legendPluvioF.textContent = '('+p6+')';
    legendPluvioG.innerText = legendPluvioG.textContent = '('+p7+')';
    legendPluvioH.innerText = legendPluvioH.textContent = '('+p8+')';
};


/*layer chips inativos por operadoras*/
layerPcdsInativasOperadoraVivoPluvio = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_vivo_pluvio'});
layerPcdsInativasOperadoraClaroPluvio = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_claro_pluvio'});
layerPcdsInativasOperadoraOiPluvio = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_oi_pluvio'});
layerPcdsInativasOperadoraTimPluvio = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_tim_pluvio'});
layerPcdsInativasOperadoraVodafonePluvio = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_vodafone_pluvio'});
layerPcdsInativasOperadoraNullPluvio = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_null_pluvio'});

map1.addLayer(layerPcdsInativasOperadoraVivoPluvio);
map1.addLayer(layerPcdsInativasOperadoraClaroPluvio);
map1.addLayer(layerPcdsInativasOperadoraOiPluvio);
map1.addLayer(layerPcdsInativasOperadoraTimPluvio);
map1.addLayer(layerPcdsInativasOperadoraVodafonePluvio);
map1.addLayer(layerPcdsInativasOperadoraNullPluvio);

function lerArrayPcdsInativasOperadorasPluvio(evt){
    for (var pcd in evt) {
        if (evt[pcd][9] === 'Vivo') {
            var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
            createPinHidro(layerPcdsInativasOperadoraVivoPluvio, geom, evt[pcd], '#9d4aea', "pin_" + pcd);
        }        
        if (evt[pcd][9] === 'Claro') {
            var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
            createPinHidro(layerPcdsInativasOperadoraClaroPluvio, geom, evt[pcd], '#bc0000cf', "pin_" + pcd);
        }
        if (evt[pcd][9] === 'Oi') {
            var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
            createPinHidro(layerPcdsInativasOperadoraOiPluvio, geom, evt[pcd], '#ffb100', "pin_" + pcd);
        }
        if (evt[pcd][9] === 'Tim') {
            var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
            createPinHidro(layerPcdsInativasOperadoraTimPluvio, geom, evt[pcd], '#5151f0', "pin_" + pcd);
        }       
        if (evt[pcd][9] === 'Vodafone') {
            var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
            createPinHidro(layerPcdsInativasOperadoraTimPluvio, geom, evt[pcd], '#ff0000', "pin_" + pcd);
        }
        if (evt[pcd][9] === null) {
            var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
            createPinHidro(layerPcdsInativasOperadoraNullPluvio, geom, evt[pcd], '#22262e', "pin_" + pcd);
        }         
    }
};
/*layer chips inativos por operadoras*/

function getPointFromLongLatPluvio(lat, long) {
    return ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857');
}

function  createPinPluvio(arrLayers, geom, pcd, color, idPin) {
    var pinFeature = new ol.Feature({
        geometry: geom,
        pcd: pcd,
        id: idPin
    });
    var pinStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: color
            }),
            stroke: new ol.style.Stroke({
                color: '#323238',
                width: 1
            })
        })
    });
    pinFeature.setStyle(pinStyle);
    var vectorSource = new ol.source.Vector({
        features: [pinFeature]
    });
    var pinLayer = new ol.layer.Vector({
        name: 'PinLayer',
        source: vectorSource
    });
    arrLayers.getLayers().push(pinLayer);
    return pinLayer;
}
;

function  createPinPluvioDesabilitada(arrLayers, geom, pcd, color, idPin) {
    var pinFeature = new ol.Feature({
        geometry: geom,
        pcd: pcd,
        id: idPin
    });
    var pinStyle = new ol.style.Style({
        image: new ol.style.RegularShape({
            radius: 9,
            points: 3,
            angle: 0,
            fill: new ol.style.Fill({
                color: color
            }),
            stroke: new ol.style.Stroke({
                color: '#ff0808',
                width: 1.5
            })
        })
    });
    pinFeature.setStyle(pinStyle);
    var vectorSource = new ol.source.Vector({
        features: [pinFeature]
    });
    var pinLayer = new ol.layer.Vector({
        name: 'PinLayer',
        source: vectorSource
    });
    arrLayers.getLayers().push(pinLayer);
    return pinLayer;
}
;


function findLayerPluvio(value) {
    var layer = map1.getLayers();
    var key = 'name';

    if (layer) {
        var layers = layer.getArray(),
                len = layers.length, result;

        for (var i = 0; i < len; i++) {
            if (layers[i].get(key) === value) {
                return layers[i];
            }
        }
    }
    return null;
}

var legendaPluvioInatividade = document.getElementById("legenda-dias-inatividade-pluvio");
var clickInatividadeTempoPluvio = document.getElementById("inatividade-tempo-pluvio");
clickInatividadeTempoPluvio.onclick = function (e){
  e.preventDefault();
  legendaPluvioInatividade.classList.toggle('display');
};


$('#overlayPluvio li').click(function () {
    if ($(this).hasClass("sub-menu")) {
        var currentLayer = $(this).closest("[data-layer]").data("layer");

        if (currentLayer === 'ativa_pluvio') {
            if ($(this).hasClass("mark_selected_ativas")) {
                $(this).removeClass("mark_selected_ativas");
                setLayerVisiblePluvio(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_ativas");
                setLayerVisiblePluvio(currentLayer, true);
            }
        }
        if (currentLayer === 'inatividade_pluvio') {
            if ($(this).hasClass("mark_selected_inativas")) {
                $(this).removeClass("mark_selected_inativas");
                setLayerVisiblePluvio(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_inativas");
                setLayerVisiblePluvio(currentLayer, true);
            }
        }
        
        if (currentLayer === 'inatividade_pluvio_tempo') {
            if ($(this).hasClass("mark_selected_inatividade_tempo_pluvio")) {
                $(this).removeClass("mark_selected_inatividade_tempo_pluvio");
                setLayerVisiblePluvio(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_inatividade_tempo_pluvio");
                setLayerVisiblePluvio(currentLayer, true);
            }
        }                        
        if (currentLayer === 'suspeita_pluvio') {
            if ($(this).hasClass("mark_selected_suspeita")) {
                $(this).removeClass("mark_selected_suspeita");
                setLayerVisiblePluvio(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_suspeita");
                setLayerVisiblePluvio(currentLayer, true);
            }
        }
        if (currentLayer === 'desabilitada_pluvio') {
            if ($(this).hasClass("mark_selected_desabilitada")) {
                $(this).removeClass("mark_selected_desabilitada");
                setLayerVisiblePluvio(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_desabilitada");
                setLayerVisiblePluvio(currentLayer, true);
            }
        }
        
        /*operadoras*/
        
        //vodafone-PLUVIO
        if (currentLayer === 'chip_inativo_vodafone_pluvio') {
            if ($(this).hasClass("mark_selected_chip_inativo_vodafone_pluvio")) {
                $(this).removeClass("mark_selected_chip_inativo_vodafone_pluvio");
                setLayerVisiblePluvio(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_vodafone_pluvio");
                setLayerVisiblePluvio(currentLayer, true);
            }
        }
        
        //Oi-PLUVIO
        if (currentLayer === 'chip_inativo_oi_pluvio') {
            if ($(this).hasClass("mark_selected_chip_inativo_oi_pluvio")) {
                $(this).removeClass("mark_selected_chip_inativo_oi_pluvio");
                setLayerVisiblePluvio(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_oi_pluvio");
                setLayerVisiblePluvio(currentLayer, true);
            }
        }
        
        //vivo-PLUVIO
        if (currentLayer === 'chip_inativo_vivo_pluvio') {
            if ($(this).hasClass("mark_selected_chip_inativo_vivo_pluvio")) {
                $(this).removeClass("mark_selected_chip_inativo_vivo_pluvio");
                setLayerVisiblePluvio(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_vivo_pluvio");
                setLayerVisiblePluvio(currentLayer, true);
            }
        }
        
        //claro-PLUVIO       
        if (currentLayer === 'chip_inativo_claro_pluvio') {
            if ($(this).hasClass("mark_selected_chip_inativo_claro_pluvio")) {
                $(this).removeClass("mark_selected_chip_inativo_claro_pluvio");
                setLayerVisiblePluvio(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_claro_pluvio");
                setLayerVisiblePluvio(currentLayer, true);
            }
        }
        
        //tim-PLUVIO        
        if (currentLayer === 'chip_inativo_tim_pluvio') {
            if ($(this).hasClass("mark_selected_chip_inativo_tim_pluvio")) {
                $(this).removeClass("mark_selected_chip_inativo_tim_pluvio");
                setLayerVisiblePluvio(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_tim_pluvio");
                setLayerVisiblePluvio(currentLayer, true);
            }
        }        
        
        //tim-SEM CHIP        
        if (currentLayer === 'chip_inativo_null_pluvio') {
            if ($(this).hasClass("mark_selected_chip_inativo_null_pluvio")) {
                $(this).removeClass("mark_selected_chip_inativo_null_pluvio");
                setLayerVisiblePluvio(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_null_pluvio");
                setLayerVisiblePluvio(currentLayer, true);
            }
        }  
        /*operadoras*/
        
        
        if (currentLayer === 'area_risco_sem_indice') {
            if ($(this).hasClass("mark_selected_risco_sem_indice")) {
                $(this).removeClass("mark_selected_risco_sem_indice");
                setLayerVisiblePluvio(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_risco_sem_indice");
                setLayerVisiblePluvio(currentLayer, true);
            }
        }
                
        if (currentLayer === 'risco_geologico') {
            if ($(this).hasClass("mark_selected_risco_geologico")) {
                $(this).removeClass("mark_selected_risco_geologico");
                setLayerVisiblePluvio(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_risco_geologico");
                setLayerVisiblePluvio(currentLayer, true);
            }
        }               

        if (currentLayer === 'risco_hidrologico') {
            if ($(this).hasClass("mark_selected_risco_hidro")) {
                $(this).removeClass("mark_selected_risco_hidro");
                setLayerVisiblePluvio(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_risco_hidro");
                setLayerVisiblePluvio(currentLayer, true);
            }
        }
    } else {
        var currentParent = $(this).closest("[data-parent]").data("parent");
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $('#overlayPluvio li[data-parent="' + currentParent + '"]').removeClass('menu-unfold');
        } else {
            $(this).addClass("selected");
            $('#overlayPluvio li[data-parent="' + currentParent + '"]').addClass('menu-unfold');
        }
    }
}
);

function setLayerVisiblePluvio(index, value) {
    var layerPluvio = findLayerPluvio(index);
    layerPluvio.setVisible(value);
}
