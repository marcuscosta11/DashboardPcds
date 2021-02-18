/* global ol */

var arrLayersAcqua = [];
// MAPA
arrLayersAcqua[0] = new ol.layer.Tile({
    title: "PCD's Acqua",
//    source: new ol.source.OSM()
    source: new ol.source.XYZ({url: "http://virt142.cemaden.gov.br/osm_tiles/{z}/{x}/{y}.png"})
});

// Estados
arrLayersAcqua[1] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:br_estados', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'brEstados'
});

//área de risco sem indice
arrLayersAcqua[2] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:areasrisco_inov_sem_indice', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'area_risco_sem_indice_acqua',
    visible: false
});

//risco hidro
arrLayersAcqua[3] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:risco_hidro_uf', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'risco_hidrologico_acqua',
    visible: false
});

/*risco geologico*/
arrLayersAcqua[4] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:movimento_massa_uf', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'risco_geologico_acqua',
    visible: false
});



/*Construção do mapa*/
var map2 = new ol.Map({
    target: 'map2',
    controls: ol.control.defaults().extend([
//                    new ol.control.FullScreen()
    ]),
    layers: arrLayersAcqua,
    view: new ol.View({
        center: ol.proj.fromLonLat([-55, -10]),
        zoom: 4
    })
});

var legendAcquaA = document.getElementById("inatividade-a0");
var legendAcquaB = document.getElementById("inatividade-a1");
var legendAcquaC = document.getElementById("inatividade-a2");
var legendAcquaD = document.getElementById("inatividade-a3");
var legendAcquaE = document.getElementById("inatividade-a4");
var legendAcquaF = document.getElementById("inatividade-a5");
var legendAcquaG = document.getElementById("inatividade-a6");
var legendAcquaH = document.getElementById("inatividade-a7");

/*onclick*/
var containerAcqua = document.getElementById('popup-acqua');
var contentAcqua = document.getElementById('popup-content-acqua');
var closerAcqua = document.getElementById('popup-closer-acqua');
var hoverInfoAcqua = document.getElementById('infoPcdAcqua');
var popupAcqua = new ol.Overlay({
    element: containerAcqua,
    positioning: 'bottom-center',
    stopEvent: false,
    autoPan: true,
    offset: [0, -20]
});


map2.addOverlay(popupAcqua);
closerAcqua.onclick = function () {
    popupAcqua.setPosition(undefined);
    closerAcqua.blur();
    return false;
};

map2.on('click', function (evt) {
    var feature = map2.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });

    if (feature) {
        popupOnHoverAcqua.setPosition(undefined);
        closerHoverAcqua.blur();
        var coordinates = feature.getGeometry().getCoordinates();
        popupAcqua.setPosition(coordinates);
        var pcd = feature.get('pcd');
        var date = new Date(pcd[8]).toLocaleString('pt-BR');        
        var htmlDados = "";
        for (var dado in pcd.dados) { 
            htmlDados = htmlDados.concat('<p style="color:#e2d9d9; font-size: small"><strong>IdPcd: </strong>' + pcd.dados[dado].idPcd + ' <br>\n\<br>');
        }
        contentAcqua.innerHTML = '<p style="color:#e2d9d9; font-size: small"><strong>Estacao: </strong>' + pcd[3] + '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Nome: </strong>' + pcd[2] + '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Operadora: </strong>' +pcd[9]+' - '+pcd[10]+ '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Última Conexão: </strong>' + date + '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Dias de Inatividade: </strong>' + qtdDiasInatividade(pcd[8])+ '</p>\n\
                             <p style="color:#e2d9d9; font-size: inherit; text-decoration: underline; font-weight: bold "><a target="_blank" href="http://sjc.salvar.cemaden.gov.br/resources/graficos/interativo/grafico_Acqua_CEMADEN.php?idpcd=' +pcd[1]+'&uf='+pcd[6]+'">Link Mapa Interativo</a></p>\n\
                             </p>' + htmlDados;
    } else {
        popupAcqua.setPosition(undefined);
        closerAcqua.blur();
    }
});


/*onclick*/

/*onHover*/
var containerHoverAcqua = document.getElementById('popup-hover-acqua');
var closerHoverAcqua = document.getElementById('popup-closer-hover-acqua');
var hoverInfoAcqua = document.getElementById('infoPcdAcqua');

var popupOnHoverAcqua = new ol.Overlay({
    element: containerHoverAcqua,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -20]
});

map2.addOverlay(popupOnHoverAcqua);
closerHoverAcqua.onclick = function () {
    popupOnHoverAcqua.setPosition(undefined);
    closerHoverAcqua.blur();
    return false;
};

map2.on('pointermove', function (evt) {
    var feature_onHover = map2.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });
    
    if (feature_onHover) {
        var coordinates = feature_onHover.getGeometry().getCoordinates();
        popupOnHoverAcqua.setPosition(coordinates);
        var pcd = feature_onHover.get('pcd');
        var htmlDados = "";
        hoverInfoAcqua.innerHTML = '<p style="color:#e2d9d9; font-size: small; font-weight: bold">'+pcd[3]+' - '+pcd[2]+'</p>\
                                  <p style="color:#e2d9d9; font-size: small; font-weight: bold">'+pcd[7]+' - '+pcd[6]+'</p>\
                                  ' + htmlDados;
    }else {
       popupOnHoverAcqua.setPosition(undefined);
       closerHoverAcqua.blur();
    }
});
/*onHover*/


map2.on('pointermove', function (e) {
    var pixel = map2.getEventPixel(e.originalEvent);
    var hit = map2.hasFeatureAtPixel(pixel);
    var divTarget = document.getElementById(map2.getTarget());
    divTarget.style.cursor = hit ? 'pointer' : '';
});

$(document).ready(function () {
    findLayerAcqua("inatividade_acqua");
    findLayerAcqua("ativa_acqua");
    findLayerAcqua("suspeita_acqua");
    findLayerAcqua("desabilitada_acqua");    
});

function getStatusPcdsAcquaMap(){
     $.ajax({
        async: true,
        global: false,        
//        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonStatusPcdsAcqua",/*local cemaden*/
//        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonStatusPcdsAcqua",/*meu desk*/
        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonStatusPcdsAcqua",
        dataType: "json",
        cache: false,
        crossDomain: true,
        success: function (data) {
            lerArrayAcquaInativas(data.ACQUA_INATIVA);
            lerArrayAcquaInativasTempo(data.ACQUA_INATIVA);
            lerArrayAcquaAtivas(data.ACQUA_ATIVA);
            lerArrayAcquaSuspeitas(data.ACQUA_SUSPEITA);
            lerArrayAcquaDesabilitadas(data.ACQUA_DESABILITADA);
            map2.updateSize();
        }
    }); 
}

function getPcdsInativasOperadorasAcqua(){
     $.ajax({
        async: true,
        global: false,        
//        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonPcdsInativasOperadora",/*local cemaden*/
//        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonPcdsInativasOperadora",/*meu desk*/
        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonPcdsInativasOperadora",
        dataType: "json",
        cache: false,
        crossDomain: true,
        success: function (data) {            
            lerArrayPcdsInativasOperadorasAcqua(data.acqua);            
            map2.updateSize();
        }
    }); 
}

layerAcquaAtivas = new ol.layer.Group({layers: [], visible: false, name: 'ativa_acqua'});
map2.addLayer(layerAcquaAtivas);
function lerArrayAcquaAtivas(evt){     
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatAcqua(evt[pcd][4], evt[pcd][5]));
        createPinAcqua(layerAcquaAtivas, geom, evt[pcd], '#64e572', "pin_" + pcd);
    }   
};

layerAcquaInativas = new ol.layer.Group({layers: [], visible: true, name: 'inatividade_acqua'});
map2.addLayer(layerAcquaInativas);
function lerArrayAcquaInativas(evt){
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatAcqua(evt[pcd][4], evt[pcd][5]));
        createPinAcqua(layerAcquaInativas, geom, evt[pcd], '#f25d59', "pin_" + pcd);
    }   
};

layerAcquaSuspeitas = new ol.layer.Group({layers: [], visible: false, name: 'suspeita_acqua'});
map2.addLayer(layerAcquaSuspeitas);
function lerArrayAcquaSuspeitas(evt){
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatAcqua(evt[pcd][4], evt[pcd][5]));
        createPinAcqua(layerAcquaSuspeitas, geom, evt[pcd], '#ff9500', "pin_" + pcd);
    }
};

layerAcquaDesabilitada = new ol.layer.Group({layers: [], visible: false, name: 'desabilitada_acqua'});
map2.addLayer(layerAcquaDesabilitada);
function lerArrayAcquaDesabilitadas(evt){
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatAcqua(evt[pcd][4], evt[pcd][5]));
        createPinAcquaDesabilitada(layerAcquaDesabilitada, geom, evt[pcd], '#000000', "pin_" + pcd);
    }
};

layerAcquaInativasTempo = new ol.layer.Group({layers: [], visible: false, name: 'inatividade_acqua_tempo'});     
map2.addLayer(layerAcquaInativasTempo);
function lerArrayAcquaInativasTempo(evt){
    var a = 0, b = 0,c = 0,d = 0, e = 0, f = 0,g = 0,h = 0;
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatAcqua(evt[pcd][4], evt[pcd][5]));        
        createPinAcqua(layerAcquaInativasTempo, geom, evt[pcd], inatividadeTempo(evt[pcd][8]), "pin_" + pcd);        
        var diasInatividade = qtdDiasInatividade(evt[pcd][8]);       
        if (diasInatividade === 0) {a = a + 1;}
        if (diasInatividade >= 1 && diasInatividade <= 30) {b = b + 1;}
        if (diasInatividade >= 31 && diasInatividade <= 60) {c = c + 1;}
        if (diasInatividade >= 61 && diasInatividade <= 90) {d = d + 1;}
        if (diasInatividade >= 91 && diasInatividade <= 300) {e = e + 1;}
        if (diasInatividade >= 301 && diasInatividade <= 600) {f = f + 1;}
        if (diasInatividade > 600) {g = g + 1;}
        if (isNaN(diasInatividade)) {h = h + 1;}
    }
    legendAcquaA.innerText = legendAcquaA.textContent = '('+a+')';
    legendAcquaB.innerText = legendAcquaB.textContent = '('+b+')';
    legendAcquaC.innerText = legendAcquaC.textContent = '('+c+')';
    legendAcquaD.innerText = legendAcquaD.textContent = '('+d+')';
    legendAcquaE.innerText = legendAcquaE.textContent = '('+e+')';
    legendAcquaF.innerText = legendAcquaF.textContent = '('+f+')';
    legendAcquaG.innerText = legendAcquaG.textContent = '('+g+')';
    legendAcquaH.innerText = legendAcquaH.textContent = '('+h+')';
};

/*layer chips inativos por operadoras*/
layerPcdsInativasOperadoraVivoAcqua = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_vivo_acqua'});
layerPcdsInativasOperadoraClaroAcqua = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_claro_acqua'});
layerPcdsInativasOperadoraOiAcqua = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_oi_acqua'});
layerPcdsInativasOperadoraTimAcqua = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_tim_acqua'});
layerPcdsInativasOperadoraVodafoneAcqua = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_vodafone_acqua'});
layerPcdsInativasOperadoraNullAcqua = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_null_acqua'});

map2.addLayer(layerPcdsInativasOperadoraVivoAcqua);
map2.addLayer(layerPcdsInativasOperadoraClaroAcqua);
map2.addLayer(layerPcdsInativasOperadoraOiAcqua);
map2.addLayer(layerPcdsInativasOperadoraTimAcqua);
map2.addLayer(layerPcdsInativasOperadoraVodafoneAcqua);
map2.addLayer(layerPcdsInativasOperadoraNullAcqua);

function lerArrayPcdsInativasOperadorasAcqua(evt){
    for (var pcd in evt) {
        if (evt[pcd][9] === 'Vivo') {
            var geom = new ol.geom.Point(getPointFromLongLatGeo(evt[pcd][4], evt[pcd][5]));
            createPinAcqua(layerPcdsInativasOperadoraVivoAcqua, geom, evt[pcd], '#9d4aea', "pin_" + pcd);
        }        
        if (evt[pcd][9] === 'Claro') {
            var geom = new ol.geom.Point(getPointFromLongLatGeo(evt[pcd][4], evt[pcd][5]));
            createPinAcqua(layerPcdsInativasOperadoraClaroAcqua, geom, evt[pcd], '#bc0000cf', "pin_" + pcd);
        }
        if (evt[pcd][9] === 'Oi') {
            var geom = new ol.geom.Point(getPointFromLongLatGeo(evt[pcd][4], evt[pcd][5]));
            createPinAcqua(layerPcdsInativasOperadoraOiAcqua, geom, evt[pcd], '#ffb100', "pin_" + pcd);
        }
        if (evt[pcd][9] === 'Tim') {
            var geom = new ol.geom.Point(getPointFromLongLatGeo(evt[pcd][4], evt[pcd][5]));
            createPinAcqua(layerPcdsInativasOperadoraTimAcqua, geom, evt[pcd], '#5151f0', "pin_" + pcd);
        }       
        if (evt[pcd][9] === 'Vodafone') {
            var geom = new ol.geom.Point(getPointFromLongLatGeo(evt[pcd][4], evt[pcd][5]));
            createPinAcqua(layerPcdsInativasOperadoraTimAcqua, geom, evt[pcd], '#ff0000', "pin_" + pcd);
        }
        if (evt[pcd][9] === null) {
            var geom = new ol.geom.Point(getPointFromLongLatGeo(evt[pcd][4], evt[pcd][5]));
            createPinAcqua(layerPcdsInativasOperadoraNullAcqua, geom, evt[pcd], '#22262e', "pin_" + pcd);
        }         
    }
};
/*layer chips inativos por operadoras*/

function getPointFromLongLatAcqua(lat, long) {
    return ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857');
}

function  createPinAcqua(arrLayers, geom, pcd, color, idPin) {
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
};

function  createPinAcquaDesabilitada(arrLayers, geom, pcd, color, idPin) {
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
};

function findLayerAcqua(value) {
    var layer = map2.getLayers();
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

var legendaAcquaInatividade = document.getElementById("legenda-dias-inatividade-acqua");
var clickInatividadeTempoAcqua = document.getElementById("inatividade-tempo-acqua");
clickInatividadeTempoAcqua.onclick = function (e){
  e.preventDefault();
  legendaAcquaInatividade.classList.toggle('display');
};

$('#overlayAcqua li').click(function () {
    if ($(this).hasClass("sub-menu")) {        
        var currentLayer = $(this).closest("[data-layer]").data("layer");        
        if (currentLayer === 'ativa_acqua') {
            if ($(this).hasClass("mark_selected_ativas")) {
                $(this).removeClass("mark_selected_ativas");
                setLayerVisibleAcqua(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_ativas");
                setLayerVisibleAcqua(currentLayer, true);
            }
        }        
        if (currentLayer === 'inatividade_acqua') {
            if ($(this).hasClass("mark_selected_inativas")) {
                $(this).removeClass("mark_selected_inativas");
                setLayerVisibleAcqua(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_inativas");
                setLayerVisibleAcqua(currentLayer, true);
            }
        }  
        if (currentLayer === 'inatividade_acqua_tempo') {
            if ($(this).hasClass("mark_selected_inatividade_tempo_acqua")) {
                $(this).removeClass("mark_selected_inatividade_tempo_acqua");
                setLayerVisibleAcqua(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_inatividade_tempo_acqua");
                setLayerVisibleAcqua(currentLayer, true);
            }
        } 
        
        if (currentLayer === 'suspeita_acqua') {
            if ($(this).hasClass("mark_selected_suspeita")) {
                $(this).removeClass("mark_selected_suspeita");
                setLayerVisibleAcqua(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_suspeita");
                setLayerVisibleAcqua(currentLayer, true);
            }
        }        
        if (currentLayer === 'desabilitada_acqua') {
            if ($(this).hasClass("mark_selected_desabilitada")) {
                $(this).removeClass("mark_selected_desabilitada");
                setLayerVisibleAcqua(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_desabilitada");
                setLayerVisibleAcqua(currentLayer, true);
            }
        }  
        
        /*operadoras*/
        
        //vodafone-ACQUA
        if (currentLayer === 'chip_inativo_vodafone_acqua') {
            if ($(this).hasClass("mark_selected_chip_inativo_vodafone_acqua")) {
                $(this).removeClass("mark_selected_chip_inativo_vodafone_acqua");
                setLayerVisibleAcqua(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_vodafone_acqua");
                setLayerVisibleAcqua(currentLayer, true);
            }
        }
        
        //Oi-ACQUA
        if (currentLayer === 'chip_inativo_oi_acqua') {
            if ($(this).hasClass("mark_selected_chip_inativo_oi_acqua")) {
                $(this).removeClass("mark_selected_chip_inativo_oi_acqua");
                setLayerVisibleAcqua(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_oi_acqua");
                setLayerVisibleAcqua(currentLayer, true);
            }
        }
        
        //vivo-ACQUA
        if (currentLayer === 'chip_inativo_vivo_acqua') {
            if ($(this).hasClass("mark_selected_chip_inativo_vivo_acqua")) {
                $(this).removeClass("mark_selected_chip_inativo_vivo_acqua");
                setLayerVisibleAcqua(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_vivo_acqua");
                setLayerVisibleAcqua(currentLayer, true);
            }
        }
        
        //claro-ACQUA       
        if (currentLayer === 'chip_inativo_claro_acqua') {
            if ($(this).hasClass("mark_selected_chip_inativo_claro_acqua")) {
                $(this).removeClass("mark_selected_chip_inativo_claro_acqua");
                setLayerVisibleAcqua(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_claro_acqua");
                setLayerVisibleAcqua(currentLayer, true);
            }
        }
        
        //tim-ACQUA      
        if (currentLayer === 'chip_inativo_tim_acqua') {
            if ($(this).hasClass("mark_selected_chip_inativo_tim_acqua")) {
                $(this).removeClass("mark_selected_chip_inativo_tim_acqua");
                setLayerVisibleAcqua(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_tim_acqua");
                setLayerVisibleAcqua(currentLayer, true);
            }
        }        
        
        //tim-SEM CHIP     
        if (currentLayer === 'chip_inativo_null_acqua') {
            if ($(this).hasClass("mark_selected_chip_inativo_null_acqua")) {
                $(this).removeClass("mark_selected_chip_inativo_null_acqua");
                setLayerVisibleAcqua(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_null_acqua");
                setLayerVisibleAcqua(currentLayer, true);
            }
        }     
        
        /*operadoras*/
        
        if (currentLayer === 'area_risco_sem_indice_acqua') {
            if ($(this).hasClass("mark_selected_risco_sem_indice_acqua")) {
                $(this).removeClass("mark_selected_risco_sem_indice_acqua");
                setLayerVisibleAcqua(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_risco_sem_indice_acqua");
                setLayerVisibleAcqua(currentLayer, true);
            }
        }        
        if (currentLayer === 'risco_hidrologico_acqua') {
            if ($(this).hasClass("mark_selected_risco_hidro_acqua")) {
                $(this).removeClass("mark_selected_risco_hidro_acqua");
                setLayerVisibleAcqua(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_risco_hidro_acqua");
                setLayerVisibleAcqua(currentLayer, true);
            }
        }            
         if (currentLayer === 'risco_geologico_acqua') {
            if ($(this).hasClass("mark_selected_risco_geologico_acqua")) {
                $(this).removeClass("mark_selected_risco_geologico_acqua");
                setLayerVisibleAcqua(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_risco_geologico_acqua");
                setLayerVisibleAcqua(currentLayer, true);
            }
        }        
    } else {
        var currentParent = $(this).closest("[data-parent]").data("parent");
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $('#overlayAcqua li[data-parent="' + currentParent + '"]').removeClass('menu-unfold');
        } else {
            $(this).addClass("selected");
            $('#overlayAcqua li[data-parent="' + currentParent + '"]').addClass('menu-unfold');
        }
    }
}
);

function setLayerVisibleAcqua(index, value) {
    var layerAcqua = findLayerAcqua(index);
    layerAcqua.setVisible(value);
}