/**
 * @author Marcus Costa - 12/04/2019
 */

/* global ol */

var arrLayersQuadroGeral = [];
// MAPA
arrLayersQuadroGeral[0] = new ol.layer.Tile({
    title: "Quadro Geral",
    source: new ol.source.OSM()
//    source: new ol.source.XYZ({url: "http://virt142.cemaden.gov.br/osm_tiles/{z}/{x}/{y}.png"})
});

// Estados
arrLayersQuadroGeral[1] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:br_estados', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'brEstados'
});

//área de risco sem indice
arrLayersQuadroGeral[2] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:areasrisco_inov_sem_indice', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'area_risco_sem_indice_geral',
    visible: false
});

//risco hidro
arrLayersQuadroGeral[3] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:risco_hidro_uf', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'risco_hidrologico_geral',
    visible: false
});

//risco geologico
arrLayersQuadroGeral[4] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:movimento_massa_uf', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'risco_geologico_geral',
    visible: false
});


/*Construção do mapa*/
var map = new ol.Map({
    target: 'map',
    controls: ol.control.defaults().extend([
//                    new ol.control.FullScreen()
    ]),
    layers: arrLayersQuadroGeral,
    view: new ol.View({
        center: ol.proj.fromLonLat([-55, -10]),
        zoom: 3.85
    })
});

//on click
var hoverInfoGeral = document.getElementById('infoPcdGeral');
var containerQuadroGeral = document.getElementById('popup-geral');
var contentQuadroGeral = document.getElementById('popup-content-geral');
var closerQuadroGeral = document.getElementById('popup-closer-geral');
var popupQuadroGeral = new ol.Overlay({
    element: containerQuadroGeral,
    positioning: 'bottom-center',
    stopEvent: false,
    autoPan: true,
    offset: [0, -20]
});
map.addOverlay(popupQuadroGeral);
closerQuadroGeral.onclick = function () {
    popupQuadroGeral.setPosition(undefined);
    closerQuadroGeral.blur();
    return false;
};


/*On Hover*/
var containerHoverGeral = document.getElementById('popup-hover-geral');
var closerHoverGeral = document.getElementById('popup-closer-hover-geral');
var hoverInfoGeral = document.getElementById('infoPcdGeral');
var popupOnHoverGeral = new ol.Overlay({
    element: containerHoverGeral,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -20]
});
map.addOverlay(popupOnHoverGeral);
closerHoverGeral.onclick = function () {
    popupOnHoverGeral.setPosition(undefined);
    closerHoverGeral.blur();
    return false;
};


//on click
map.on('click', function (evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });

    if (feature) {
        popupOnHoverGeral.setPosition(undefined);
        closerHoverGeral.blur();
        var coordinates = feature.getGeometry().getCoordinates();
        popupQuadroGeral.setPosition(coordinates);
        var pcd = feature.get('pcd');
        var date = new Date(pcd[2]).toLocaleString('pt-BR');        
        var htmlDados = "";

        for (var dado in pcd.dados) { 
            htmlDados = htmlDados.concat('<p style="color:#e2d9d9; font-size: small"><strong>IdPcd: </strong>' + pcd.dados[dado].idPcd + ' <br>\n\<br>');
        }
        contentQuadroGeral.innerHTML = '<p style="color:#e2d9d9; font-size: small"><strong>Estacao: </strong>' + pcd[5] + '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Nome: </strong>' + pcd[3] + '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Tipo: </strong>' + pcd[4] + '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Última Conexão: </strong>' + date + '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Dias de Inatividade: </strong>' + qtdDiasInatividade(pcd[2]) + '</p>' + htmlDados;
    } else {
        popupQuadroGeral.setPosition(undefined);
        closerQuadroGeral.blur();
    }
});

//on hover
map.on('pointermove', function (evt) {
    var feature_onHover = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });
    
    if (feature_onHover) {
        var coordinates = feature_onHover.getGeometry().getCoordinates();
        popupOnHoverGeral.setPosition(coordinates);
        var pcd = feature_onHover.get('pcd');
        var htmlDados = "";
        hoverInfoGeral.innerHTML = '<p style="color:#e2d9d9; font-size: small; font-weight: bold">'+pcd[4]+' - '+pcd[3]+'</p>\
                                  <p style="color:#e2d9d9; font-size: small; font-weight: bold">'+pcd[8]+' - '+pcd[9]+'</p>\
                                  ' + htmlDados;
    }else {
       popupOnHoverGeral.setPosition(undefined);
        closerHoverGeral.blur();
    }
});
/*On Hover*/


map.on('pointermove', function (e) {
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    var divTarget = document.getElementById(map.getTarget());
    divTarget.style.cursor = hit ? 'pointer' : '';
});


/*legenda*/
var legendA = document.getElementById("inatividade0");
var legendB = document.getElementById("inatividade1");
var legendC = document.getElementById("inatividade2");
var legendD = document.getElementById("inatividade3");
var legendE = document.getElementById("inatividade4");
var legendF = document.getElementById("inatividade5");
var legendG = document.getElementById("inatividade6");
var legendH = document.getElementById("inatividade7");

$(document).ready(function() {
    findLayerQuadroGeral("inatividade_geral");
    findLayerQuadroGeral("ativa_geral");
    findLayerQuadroGeral("suspeita_geral");
    findLayerQuadroGeral("desabilitada_geral");
});

function getStatusPcdsQuadroGeralMaps(){
     $.ajax({
        async: true,
        global: false,        
//        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonStatusPcdsQuadroGeralMaps",/*local cemaden*/
        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonStatusPcdsQuadroGeralMaps",/*meu desk*/
//        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonStatusPcdsQuadroGeralMaps",
        dataType: "json",
        cache: false,
        crossDomain: true,
        success: function (data) {
            lerArrayGeralInativas(data.PCD_INATIVA);
            lerArrayGeralInativasTempo(data.PCD_INATIVA);
            lerArrayGeralAtivas(data.PCD_ATIVA);
            lerArrayGeralSuspeitas(data.PCD_SUSPEITA);
            lerArrayGeralDesabilitadas(data.PCD_DESABILITADA);
            map.updateSize();
        }
    }); 
}

layerGeralAtivas = new ol.layer.Group({layers: [], visible: false, name: 'ativa_geral'});
map.addLayer(layerGeralAtivas);
function lerArrayGeralAtivas(evt){
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatQuadroGeral(evt[pcd][6], evt[pcd][7]));
        createPinQuadroGeral(layerGeralAtivas, geom, evt[pcd], '#64e572', "pin_" + pcd);
    }
};

layerGeralInativas = new ol.layer.Group({layers: [], visible: true, name: 'inatividade_geral'});    
map.addLayer(layerGeralInativas);
function lerArrayGeralInativas( evt){
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatQuadroGeral( evt[pcd][6],  evt[pcd][7]));       
        createPinQuadroGeral(layerGeralInativas, geom,  evt[pcd], "#f25e59", "pin_" + pcd);
    }   
};


layerGeralInativasTempo = new ol.layer.Group({layers: [], visible: false, name: 'inatividade_tempo'});     
map.addLayer(layerGeralInativasTempo);
function lerArrayGeralInativasTempo(evt){
    var a = 0, b = 0,c = 0,d = 0, e = 0, f = 0,g = 0,h = 0;
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatQuadroGeral(evt[pcd][6], evt[pcd][7]));        
        createPinQuadroGeral(layerGeralInativasTempo, geom, evt[pcd], inatividadeTempo(evt[pcd][2]), "pin_" + pcd);        
        var diasInatividade = qtdDiasInatividade(evt[pcd][2]);       
        if (diasInatividade === 0) {a = a + 1;}
        if (diasInatividade >= 1 && diasInatividade <= 30) {b = b + 1;}
        if (diasInatividade >= 31 && diasInatividade <= 60) {c = c + 1;}
        if (diasInatividade >= 61 && diasInatividade <= 90) {d = d + 1;}
        if (diasInatividade >= 91 && diasInatividade <= 300) {e = e + 1;}
        if (diasInatividade >= 301 && diasInatividade <= 600) {f = f + 1;}
        if (diasInatividade > 600) {g = g + 1;}
        if (isNaN(diasInatividade)) {h = h + 1;}
    }
    legendA.innerText = legendA.textContent = '('+a+')';
    legendB.innerText = legendB.textContent = '('+b+')';
    legendC.innerText = legendC.textContent = '('+c+')';
    legendD.innerText = legendD.textContent = '('+d+')';
    legendE.innerText = legendE.textContent = '('+e+')';
    legendF.innerText = legendF.textContent = '('+f+')';
    legendG.innerText = legendG.textContent = '('+g+')';
    legendH.innerText = legendH.textContent = '('+h+')';
};

layerGeralSuspeitas = new ol.layer.Group({layers: [], visible: false, name: 'suspeita_geral'});
map.addLayer(layerGeralSuspeitas);
function lerArrayGeralSuspeitas(evt){
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatQuadroGeral(evt[pcd][6], evt[pcd][7]));
        createPinQuadroGeral(layerGeralSuspeitas, geom, evt[pcd], '#ff9500', "pin_" + pcd);
    }
};


layerGeralDesabilitada = new ol.layer.Group({layers: [], visible: false, name: 'desabilitada_geral'});
map.addLayer(layerGeralDesabilitada);
function lerArrayGeralDesabilitadas(evt){
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatQuadroGeral(evt[pcd][6], evt[pcd][7]));        
        createPinQuadroGeralDesabilitada(layerGeralDesabilitada, geom, evt[pcd], '#000000', "pin_" + pcd);
    }
};

function getPointFromLongLatQuadroGeral(lat, long) {
    return ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857');
}

function  createPinQuadroGeral(arrLayers, geom, pcd, color, idPin) {
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

function  createPinQuadroGeralDesabilitada(arrLayers, geom, pcd, color, idPin) {
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


function findLayerQuadroGeral(value) {
    var layer = map.getLayers();
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


var legenda = document.getElementById("legenda-dias-inatividade");
var clickInatividadeTempo = document.getElementById("inatividade-tempo");
clickInatividadeTempo.onclick = function (e){
  e.preventDefault();
  legenda.classList.toggle('display');
};


$('#overlayGeral li').click(function () {
    if ($(this).hasClass("sub-menu")) {
        var currentLayer = $(this).closest("[data-layer]").data("layer");        
        if (currentLayer === 'ativa_geral') {
            if ($(this).hasClass("mark_selected_ativas")) {
                $(this).removeClass("mark_selected_ativas");
                setLayerVisibleQuadroGeral(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_ativas");
                setLayerVisibleQuadroGeral(currentLayer, true);
            }
        }        
        if (currentLayer === 'inatividade_geral') {
            if ($(this).hasClass("mark_selected_inatividade")) {
                $(this).removeClass("mark_selected_inatividade");
                setLayerVisibleQuadroGeral(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_inatividade");
                setLayerVisibleQuadroGeral(currentLayer, true);
            }
            
        }          
        if (currentLayer === 'inatividade_tempo') {
            if ($(this).hasClass("mark_selected_inatividade_tempo")) {
                $(this).removeClass("mark_selected_inatividade_tempo");
                setLayerVisibleQuadroGeral(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_inatividade_tempo");
                setLayerVisibleQuadroGeral(currentLayer, true);
            }
        }          
        if (currentLayer === 'suspeita_geral') {
            if ($(this).hasClass("mark_selected_suspeita")) {
                $(this).removeClass("mark_selected_suspeita");
                setLayerVisibleQuadroGeral(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_suspeita");
                setLayerVisibleQuadroGeral(currentLayer, true);
            }
        }        
        if (currentLayer === 'desabilitada_geral') {
            if ($(this).hasClass("mark_selected_desabilitada")) {
                $(this).removeClass("mark_selected_desabilitada");
                setLayerVisibleQuadroGeral(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_desabilitada");
                setLayerVisibleQuadroGeral(currentLayer, true);
            }
        }
        
        /*operadoras*/
        
        //vodafone-GERAL
        if (currentLayer === 'chip_inativo_vodafone_geral') {
            if ($(this).hasClass("mark_selected_chip_inativo_vodafone_geral")) {
                $(this).removeClass("mark_selected_chip_inativo_vodafone_geral");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_vodafone_geral");
                setLayerVisibleGeo(currentLayer, true);
            }
        }
        
        //Oi-GERAL
        if (currentLayer === 'chip_inativo_oi_geral') {
            if ($(this).hasClass("mark_selected_chip_inativo_oi_geral")) {
                $(this).removeClass("mark_selected_chip_inativo_oi_geral");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_oi_geral");
                setLayerVisibleGeo(currentLayer, true);
            }
        }
        
        //vivo-GERAL
        if (currentLayer === 'chip_inativo_vivo_geral') {
            if ($(this).hasClass("mark_selected_chip_inativo_vivo_geral")) {
                $(this).removeClass("mark_selected_chip_inativo_vivo_geral");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_vivo_geral");
                setLayerVisibleGeo(currentLayer, true);
            }
        }
        
        //claro-GERAL       
        if (currentLayer === 'chip_inativo_claro_geral') {
            if ($(this).hasClass("mark_selected_chip_inativo_claro_geral")) {
                $(this).removeClass("mark_selected_chip_inativo_claro_geral");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_claro_geral");
                setLayerVisibleGeo(currentLayer, true);
            }
        }
        
        //tim-GERAL        
        if (currentLayer === 'chip_inativo_tim_geral') {
            if ($(this).hasClass("mark_selected_chip_inativo_tim_geral")) {
                $(this).removeClass("mark_selected_chip_inativo_tim_geral");
                setLayerVisibleGeo(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_tim_geral");
                setLayerVisibleGeo(currentLayer, true);
            }
        }        
        /*operadoras*/
        
        if (currentLayer === 'area_risco_sem_indice_geral') {
            if ($(this).hasClass("mark_selected_risco_sem_indice_geral")) {
                $(this).removeClass("mark_selected_risco_sem_indice_geral");
                setLayerVisibleQuadroGeral(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_risco_sem_indice_geral");
                setLayerVisibleQuadroGeral(currentLayer, true);
            }
        }        
        if (currentLayer === 'risco_geologico_geral') {
            if ($(this).hasClass("mark_selected_risco_geologico_geral")) {
                $(this).removeClass("mark_selected_risco_geologico_geral");
                setLayerVisibleQuadroGeral(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_risco_geologico_geral");
                setLayerVisibleQuadroGeral(currentLayer, true);
            }
        }                        
        if (currentLayer === 'risco_hidrologico_geral') {
            if ($(this).hasClass("mark_selected_risco_hidro_geral")) {
                $(this).removeClass("mark_selected_risco_hidro_geral");
                setLayerVisibleQuadroGeral(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_risco_hidro_geral");
                setLayerVisibleQuadroGeral(currentLayer, true);
            }
        }                
    } else {
        var currentParent = $(this).closest("[data-parent]").data("parent");
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $('#overlayGeral li[data-parent="' + currentParent + '"]').removeClass('menu-unfold');
        } else {
            $(this).addClass("selected");
            $('#overlayGeral li[data-parent="' + currentParent + '"]').addClass('menu-unfold');
        }
    }
}
);

function setLayerVisibleQuadroGeral(index, value) {
    var layerGeral = findLayerQuadroGeral(index);
    layerGeral.setVisible(value);
}

