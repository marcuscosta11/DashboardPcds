/**
 * @author Marcus Costa
 * @ Data: 18/04/2019
 * */

/* global ol */

var arrLayersGeotecnica = [];
// MAPA
arrLayersGeotecnica[0] = new ol.layer.Tile({
    title: "PCD's Geo",
    source: new ol.source.OSM()
//    source: new ol.source.XYZ({url: "http://virt142.cemaden.gov.br/osm_tiles/{z}/{x}/{y}.png"})
});

// Estados
arrLayersGeotecnica[1] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:br_estados', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'brEstados'
});

//área de risco sem indice
arrLayersGeotecnica[2] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:areasrisco_inov_sem_indice', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'area_risco_sem_indice_geo',
    visible: false
});

//risco hidro
arrLayersGeotecnica[3] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:risco_hidro_uf', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'risco_hidrologico_geo',
    visible: false
});

//risco Geologico
arrLayersGeotecnica[4] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:movimento_massa_uf', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'risco_geologico_geo',
    visible: false
});

function getStatusPcdsGeoMap(){
     $.ajax({
        async: true,
        global: false,        
//        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonStatusPcdsGeo",/*local cemaden*/
        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonStatusPcdsGeo",/*meu desk*/
//        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonStatusPcdsGeo",
        dataType: "json",
        cache: false,
        crossDomain: true,
        success: function (data) {            
            lerArrayGeoInativas(data.GEO_INATIVA);
            lerArrayGeoInativasTempo(data.GEO_INATIVA);
            lerArrayGeoAtivas(data.GEO_ATIVA);
            lerArrayGeoSuspeitas(data.GEO_SUSPEITA);
            lerArrayGeoDesabilitadas(data.GEO_DESABILITADA);
            map5.updateSize();
        }
    }); 
}


function getPcdsInativasOperadorasGeo(){
     $.ajax({
        async: true,
        global: false,        
//        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonPcdsInativasOperadora",/*local cemaden*/
        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonPcdsInativasOperadora",/*meu desk*/
//        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonPcdsInativasOperadora",
        dataType: "json",
        cache: false,
        crossDomain: true,
        success: function (data) {            
            lerArrayPcdsInativasOperadorasGeo(data.geo);            
            map5.updateSize();
        }
    }); 
}



/*Construção do mapa*/
var map5 = new ol.Map({
    target: 'map5',
    controls: ol.control.defaults().extend([
//                    new ol.control.FullScreen()
    ]),
    layers: arrLayersGeotecnica,
    view: new ol.View({
        center: ol.proj.fromLonLat([-55, -10]),
        zoom: 4
    })
});

var legendGeoA = document.getElementById("inatividade-g0");
var legendGeoB = document.getElementById("inatividade-g1");
var legendGeoC = document.getElementById("inatividade-g2");
var legendGeoD = document.getElementById("inatividade-g3");
var legendGeoE = document.getElementById("inatividade-g4");
var legendGeoF = document.getElementById("inatividade-g5");
var legendGeoG = document.getElementById("inatividade-g6");
var legendGeoH = document.getElementById("inatividade-g7");
var hoverInfoGeo = document.getElementById('infoPcdGeo');

/*onClick*/
var containerGeo = document.getElementById('popup-geo');
var contentGeo = document.getElementById('popup-content-geo');
var closerGeo = document.getElementById('popup-closer-geo');
var popupGeo = new ol.Overlay({
    element: containerGeo,
    positioning: 'bottom-center',
    stopEvent: false,
    autoPan: true,
    offset: [0, -20]
});

map5.addOverlay(popupGeo);
closerGeo.onclick = function () {
    popupGeo.setPosition(undefined);
    closerGeo.blur();
    return false;
};

map5.on('click', function (evt) {
    var feature_onClick = map5.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });

    if (feature_onClick) {
        popupOnHoverGeo.setPosition(undefined);
        closerHoverGeo.blur();
        var coordinates = feature_onClick.getGeometry().getCoordinates();
        popupGeo.setPosition(coordinates);
        var pcd = feature_onClick.get('pcd');
        var date = new Date(pcd[8]).toLocaleString('pt-BR');        
        var htmlDados = "";

        for (var dado in pcd.dados) { 
            htmlDados = htmlDados.concat('<p style="color:#e2d9d9; font-size: x-small"><strong>IdPcd: </strong>' + pcd.dados[dado].idPcd + ' <br>\n\<br>');
        }
        contentGeo.innerHTML = '<p style="color:#e2d9d9; font-size: small"><strong>Estacao: </strong>' + pcd[3]+ '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Nome: </strong>' + pcd[2] + '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Operadora: </strong>' +pcd[9]+' - '+pcd[10]+ '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Última Conexão: </strong>' + date + '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Dias de Inatividade: </strong>' + qtdDiasInatividade(pcd[8])+ '</p>\n\
                             <p style="color:#e2d9d9; font-size: inherit; text-decoration: underline; font-weight: bold "><a target="_blank" href="http://sjc.salvar.cemaden.gov.br/resources/graficos/interativo/grafico_geo.html?est=' + pcd[0] + '">Link Mapa Interativo</a></p>\n\
                             </p>' + htmlDados;
    } else {
        popupGeo.setPosition(undefined);
        closerGeo.blur();
    }
});
/*onClick*/

/*onHover*/
var containerHoverGeo = document.getElementById('popup-hover-geo');
var closerHoverGeo = document.getElementById('popup-closer-hover-geo');
var hoverInfoGeo = document.getElementById('infoPcdGeo');

var popupOnHoverGeo = new ol.Overlay({
    element: containerHoverGeo,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -20]
});

map5.addOverlay(popupOnHoverGeo);
closerHoverGeo.onclick = function () {
    popupOnHoverGeo.setPosition(undefined);
    closerHoverGeo.blur();
    return false;
};

map5.on('pointermove', function (evt) {
    var feature_onHover = map5.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });
    
    if (feature_onHover) {
        var coordinates = feature_onHover.getGeometry().getCoordinates();
        popupOnHoverGeo.setPosition(coordinates);
        var pcd = feature_onHover.get('pcd');
        var htmlDados = "";
        hoverInfoGeo.innerHTML = '<p style="color:#e2d9d9; font-size: small; font-weight: bold">'+pcd[3]+' - '+pcd[2]+'</p>\
                                  <p style="color:#e2d9d9; font-size: small; font-weight: bold">'+pcd[7]+' - '+pcd[6]+'</p>\
                                  ' + htmlDados;
    }else {
       popupOnHoverGeo.setPosition(undefined);
       closerHoverGeo.blur();
    }
});
/*onHover*/

map5.on('pointermove', function (e) {
    var pixel = map5.getEventPixel(e.originalEvent);
    var hit = map5.hasFeatureAtPixel(pixel);
    var divTarget = document.getElementById(map5.getTarget());
    divTarget.style.cursor = hit ? 'pointer' : '';
});

$(document).ready(function() {
    findLayerGeo("inatividade_geo");
    findLayerGeo("ativa_geo");
    findLayerGeo("suspeita_geo");
    findLayerGeo("desabilitada_geo");     
});

function lerArrayGeoAtivas(evt){
     layerGeoAtivas = new ol.layer.Group({layers: [], visible: false, name: 'ativa_geo'}); 
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatGeo(evt[pcd][4], evt[pcd][5]));
        createPinGeo(layerGeoAtivas, geom, evt[pcd], '#64e572', "pin_" + pcd);
    }
    map5.addLayer(layerGeoAtivas);
};


var layerGeoInativas = new ol.layer.Group({layers: [], name: 'inatividade_geo'});
map5.addLayer(layerGeoInativas);
function lerArrayGeoInativas(evt){     
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatGeo(evt[pcd][4], evt[pcd][5]));
        createPinGeo(layerGeoInativas, geom, evt[pcd], '#f25d59', "pin_" + pcd);
    }
};

layerGeoSuspeitas = new ol.layer.Group({layers: [], visible: false, name: 'suspeita_geo'});
map5.addLayer(layerGeoSuspeitas);
function lerArrayGeoSuspeitas(evt){
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatGeo(evt[pcd][4], evt[pcd][5]));
        createPinGeo(layerGeoSuspeitas, geom, evt[pcd], '#ff9500', "pin_" + pcd);
    }
};

layerGeoDesabilitada = new ol.layer.Group({layers: [], visible: false, name: 'desabilitada_geo'});
map5.addLayer(layerGeoDesabilitada);
function lerArrayGeoDesabilitadas(evt){
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatGeo(evt[pcd][4], evt[pcd][5]));
        createPinGeoDesabilitada(layerGeoDesabilitada, geom, evt[pcd], '#000000', "pin_" + pcd);
    }
};

layerGeoInativasTempo = new ol.layer.Group({layers: [], visible: false, name: 'inatividade_geo_tempo'});
map5.addLayer(layerGeoInativasTempo);
function lerArrayGeoInativasTempo(evt){
    var a = 0, b = 0,c = 0,d = 0, e = 0, f = 0,g = 0,h = 0;    
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatGeo(evt[pcd][4], evt[pcd][5]));        
        createPinGeo(layerGeoInativasTempo, geom, evt[pcd], inatividadeTempo(evt[pcd][8]), "pin_" + pcd);                
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
    legendGeoA.innerText = legendGeoA.textContent = '('+a+')';
    legendGeoB.innerText = legendGeoB.textContent = '('+b+')';
    legendGeoC.innerText = legendGeoC.textContent = '('+c+')';
    legendGeoD.innerText = legendGeoD.textContent = '('+d+')';
    legendGeoE.innerText = legendGeoE.textContent = '('+e+')';
    legendGeoF.innerText = legendGeoF.textContent = '('+f+')';
    legendGeoG.innerText = legendGeoG.textContent = '('+g+')';
    legendGeoH.innerText = legendGeoH.textContent = '('+h+')';
};

/*layer chips inativos por operadoras*/
layerPcdsInativasOperadoraVivo = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_vivo_geo'});
layerPcdsInativasOperadoraClaro = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_claro_geo'});
layerPcdsInativasOperadoraOi = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_oi_geo'});
layerPcdsInativasOperadoraTim = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_tim_geo'});
layerPcdsInativasOperadoraVodafone = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_vodafone_geo'});
layerPcdsInativasOperadoraNull = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_null_geo'});

map5.addLayer(layerPcdsInativasOperadoraVivo);
map5.addLayer(layerPcdsInativasOperadoraClaro);
map5.addLayer(layerPcdsInativasOperadoraOi);
map5.addLayer(layerPcdsInativasOperadoraTim);
map5.addLayer(layerPcdsInativasOperadoraVodafone);
map5.addLayer(layerPcdsInativasOperadoraNull);

function lerArrayPcdsInativasOperadorasGeo(evt){
    for (var pcd in evt) {        
        if (evt[pcd][9] === 'Vivo') {
            var geom = new ol.geom.Point(getPointFromLongLatGeo(evt[pcd][4], evt[pcd][5]));
            createPinGeo(layerPcdsInativasOperadoraVivo, geom, evt[pcd], '#9d4aea', "pin_" + pcd);
            
        }        
        if (evt[pcd][9] === 'Claro') {
            var geom = new ol.geom.Point(getPointFromLongLatGeo(evt[pcd][4], evt[pcd][5]));
            createPinGeo(layerPcdsInativasOperadoraClaro, geom, evt[pcd], '#bc0000cf', "pin_" + pcd);
        }
        if (evt[pcd][9] === 'Oi') {
            var geom = new ol.geom.Point(getPointFromLongLatGeo(evt[pcd][4], evt[pcd][5]));
            createPinGeo(layerPcdsInativasOperadoraOi, geom, evt[pcd], '#ffb100', "pin_" + pcd);
        }
        if (evt[pcd][9] === 'Tim') {
            var geom = new ol.geom.Point(getPointFromLongLatGeo(evt[pcd][4], evt[pcd][5]));
            createPinGeo(layerPcdsInativasOperadoraTim, geom, evt[pcd], '#1212cf', "pin_" + pcd);
        }       
        if (evt[pcd][9] === 'Vodafone') {
            var geom = new ol.geom.Point(getPointFromLongLatGeo(evt[pcd][4], evt[pcd][5]));
            createPinGeo(layerPcdsInativasOperadoraTim, geom, evt[pcd], '#ff0000', "pin_" + pcd);
        }
        if (evt[pcd][9] === null) {
            var geom = new ol.geom.Point(getPointFromLongLatGeo(evt[pcd][4], evt[pcd][5]));
            createPinGeo(layerPcdsInativasOperadoraNull, geom, evt[pcd], '#22262e', "pin_" + pcd);          
        }         
    }   
};
/*layer chips inativos por operadoras*/

function getPointFromLongLatGeo(lat, long) {
    return ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857');
}

function  createPinGeo(arrLayers, geom, pcd, color, idPin) {
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

function  createPinGeoDesabilitada(arrLayers, geom, pcd, color, idPin) {
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

function findLayerGeo(value) {
    var layer = map5.getLayers();
    var key = 'name';

    if (layer) {
        var layers = layer.getArray(),
        len = layers.length;
        for (var i = 0; i < len; i++) {
            if (layers[i].get(key) === value) {
                return layers[i];
            }
        }
    }
    return null;
}

var legendaGeoInatividade = document.getElementById("legenda-dias-inatividade-geo");
var clickInatividadeTempoGeo = document.getElementById("inatividade-tempo-geo");
clickInatividadeTempoGeo.onclick = function (e){
  e.preventDefault();
  legendaGeoInatividade.classList.toggle('display');
};

$('#overlayGeo li').click(function () {
    if ($(this).hasClass("sub-menu")) {
        var currentLayer = $(this).closest("[data-layer]").data("layer");
        if (currentLayer === 'ativa_geo') {
            if ($(this).hasClass("mark_selected_ativas")) {
                $(this).removeClass("mark_selected_ativas");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_ativas");
                setLayerVisibleGeo(currentLayer, true);
            }
        }
        if (currentLayer === 'inatividade_geo') {
            if ($(this).hasClass("mark_selected_inativas")) {
                $(this).removeClass("mark_selected_inativas");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_inativas");
                setLayerVisibleGeo(currentLayer, true);
            }
        }
        if (currentLayer === 'inatividade_geo_tempo') {
            if ($(this).hasClass("mark_selected_inatividade_tempo_geo")) {
                $(this).removeClass("mark_selected_inatividade_tempo_geo");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_inatividade_tempo_geo");
                setLayerVisibleGeo(currentLayer, true);
            }
        }
        if (currentLayer === 'suspeita_geo') {
            if ($(this).hasClass("mark_selected_suspeita")) {
                $(this).removeClass("mark_selected_suspeita");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_suspeita");
                setLayerVisibleGeo(currentLayer, true);
            }
        }
        if (currentLayer === 'desabilitada_geo') {
            if ($(this).hasClass("mark_selected_desabilitada")) {
                $(this).removeClass("mark_selected_desabilitada");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_desabilitada");
                setLayerVisibleGeo(currentLayer, true);
            }
        }
        
        /*operadoras*/
        
        //vodafone-GEO
        if (currentLayer === 'chip_inativo_vodafone_geo') {
            if ($(this).hasClass("mark_selected_chip_inativo_vodafone_geo")) {
                $(this).removeClass("mark_selected_chip_inativo_vodafone_geo");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_vodafone_geo");
                setLayerVisibleGeo(currentLayer, true);
            }
        }
        
        //Oi-GEO
        if (currentLayer === 'chip_inativo_oi_geo') {
            if ($(this).hasClass("mark_selected_chip_inativo_oi_geo")) {
                $(this).removeClass("mark_selected_chip_inativo_oi_geo");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_oi_geo");
                setLayerVisibleGeo(currentLayer, true);
            }
        }
        
        //vivo-GEO
        if (currentLayer === 'chip_inativo_vivo_geo') {
            if ($(this).hasClass("mark_selected_chip_inativo_vivo_geo")) {
                $(this).removeClass("mark_selected_chip_inativo_vivo_geo");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_vivo_geo");
                setLayerVisibleGeo(currentLayer, true);
            }
        }
        
        //claro-GEO        
        if (currentLayer === 'chip_inativo_claro_geo') {
            if ($(this).hasClass("mark_selected_chip_inativo_claro_geo")) {
                $(this).removeClass("mark_selected_chip_inativo_claro_geo");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_claro_geo");
                setLayerVisibleGeo(currentLayer, true);
            }
        }
        
        //tim-GEO        
        if (currentLayer === 'chip_inativo_tim_geo') {
            if ($(this).hasClass("mark_selected_chip_inativo_tim_geo")) {
                $(this).removeClass("mark_selected_chip_inativo_tim_geo");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_tim_geo");
                setLayerVisibleGeo(currentLayer, true);
            }
        }     
        
         //sem chip-GEO        
        if (currentLayer === 'chip_inativo_null_geo') {
            if ($(this).hasClass("mark_selected_chip_inativo_null_geo")) {
                $(this).removeClass("mark_selected_chip_inativo_null_geo");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_null_geo");
                setLayerVisibleGeo(currentLayer, true);
            }
        }    
        /*operadoras*/
        
        
        if (currentLayer === 'area_risco_sem_indice_geo') {
            if ($(this).hasClass("mark_selected_risco_sem_indice_geo")) {
                $(this).removeClass("mark_selected_risco_sem_indice_geo");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_risco_sem_indice_geo");
                setLayerVisibleGeo(currentLayer, true);
            }
        }

        if (currentLayer === 'risco_hidrologico_geo') {
            if ($(this).hasClass("mark_selected_risco_hidro_geo")) {
                $(this).removeClass("mark_selected_risco_hidro_geo");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_risco_hidro_geo");
                setLayerVisibleGeo(currentLayer, true);
            }
        }
        if (currentLayer === 'risco_geologico_geo') {
            if ($(this).hasClass("mark_selected_risco_geologico_geo")) {
                $(this).removeClass("mark_selected_risco_geologico_geo");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_risco_geologico_geo");
                setLayerVisibleGeo(currentLayer, true);
            }
        }
    } else {
        var currentParent = $(this).closest("[data-parent]").data("parent");
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $('#overlayGeo li[data-parent="' + currentParent + '"]').removeClass('menu-unfold');
        } else {
            $(this).addClass("selected");
            $('#overlayGeo li[data-parent="' + currentParent + '"]').addClass('menu-unfold');
        }
    }
}
);



function setLayerVisibleGeo(index, value) {
    var layerGeo = findLayerGeo(index);
    layerGeo.setVisible(value);
}
