/* global ol */

var arrLayersAgrometeorologica = [];
// MAPA
arrLayersAgrometeorologica[0] = new ol.layer.Tile({
    title: "PCD's Agro",
    source: new ol.source.OSM()
//    source: new ol.source.XYZ({url: "http://virt142.cemaden.gov.br/osm_tiles/{z}/{x}/{y}.png"})
});

// Estados
arrLayersAgrometeorologica[1] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:br_estados', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'brEstados'
});

//área de risco sem indice
arrLayersAgrometeorologica[2] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:areasrisco_inov_sem_indice', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'area_risco_sem_indice_agro',
    visible: false
});

//risco hidro
arrLayersAgrometeorologica[3] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:risco_hidro_uf', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'risco_hidrologico_agro',
    visible: false
});

//risco geologico
arrLayersAgrometeorologica[4] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:movimento_massa_uf', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'risco_geologico_agro',
    visible: false
});

/*Construção do mapa*/
var map3 = new ol.Map({
    target: 'map3',
    controls: ol.control.defaults().extend([
//                    new ol.control.FullScreen()
    ]),
    layers: arrLayersAgrometeorologica,
    view: new ol.View({
        center: ol.proj.fromLonLat([-55, -10]),
        zoom: 4
    })
});

var legendAgroA = document.getElementById("inatividade-ag0");
var legendAgroB = document.getElementById("inatividade-ag1");
var legendAgroC = document.getElementById("inatividade-ag2");
var legendAgroD = document.getElementById("inatividade-ag3");
var legendAgroE = document.getElementById("inatividade-ag4");
var legendAgroF = document.getElementById("inatividade-ag5");
var legendAgroG = document.getElementById("inatividade-ag6");
var legendAgroH = document.getElementById("inatividade-ag7");

/*on click*/
var containerAgro = document.getElementById('popup-agro');
var contentAgro = document.getElementById('popup-content-agro');
var closerAgro = document.getElementById('popup-closer-agro');
var hoverInfoAgro = document.getElementById('infoPcdAgro');

var popupAgro = new ol.Overlay({
    element: containerAgro,
    positioning: 'bottom-center',
    stopEvent: false,
    autoPan: true,
    offset: [0, -20]
});

map3.addOverlay(popupAgro);
closerAgro.onclick = function () {
    popupAgro.setPosition(undefined);
    closerAgro.blur();
    return false;
};

map3.on('click', function (evt) {
    var feature = map3.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });

    if (feature) {
        popupOnHoverAgro.setPosition(undefined);
        closerHoverAgro.blur();
        var coordinates = feature.getGeometry().getCoordinates();
        popupAgro.setPosition(coordinates);
        var pcd = feature.get('pcd');
        var date = new Date(pcd[8]).toLocaleString('pt-BR');      
        var htmlDados = "";

        for (var dado in pcd.dados) { 
            htmlDados = htmlDados.concat('<p style="color:#e2d9d9; font-size: small"><strong>IdPcd: </strong>' + pcd.dados[dado].idPcd + ' <br>\n\<br>');
        }
        contentAgro.innerHTML = '<p style="color:#e2d9d9; font-size: small"><strong>Estacao: </strong>' + pcd[3] + '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Nome: </strong>' + pcd[2] + '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Operadora: </strong>' +pcd[9]+' - '+pcd[10]+ '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Última Conexão: </strong>' + date + '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Dias de Inatividade: </strong>' + qtdDiasInatividade(pcd[8]) + '</p>\n\
                             <p style="color:#e2d9d9; font-size: inherit; text-decoration: underline; font-weight: bold "><a target="_blank" href="http://sjc.salvar.cemaden.gov.br/resources/graficos/interativo/grafico_CEMADEN.php?idpcd=' +pcd[1]+'&uf='+pcd[6]+ '">Link Mapa Interativo</a></p>\n\
                             </p>'+ htmlDados;
    } else {
        popupAgro.setPosition(undefined);
        closerAgro.blur();
    }
});
/*on click*/

/*on hover*/
var containerHoverAgro = document.getElementById('popup-hover-agro');
var closerHoverAgro = document.getElementById('popup-closer-hover-agro');
var hoverInfoAgro = document.getElementById('infoPcdAgro');

var popupOnHoverAgro = new ol.Overlay({
    element: containerHoverAgro,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -20]
});

map3.addOverlay(popupOnHoverAgro);
closerHoverAgro.onclick = function () {
    popupOnHoverAgro.setPosition(undefined);
    closerHoverAgro.blur();
    return false;
};


map3.on('pointermove', function (evt) {
    var feature_onHover = map3.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });
    
    if (feature_onHover) {
        var coordinates = feature_onHover.getGeometry().getCoordinates();
        popupOnHoverAgro.setPosition(coordinates);
        var pcd = feature_onHover.get('pcd');
        var htmlDados = "";
        hoverInfoAgro.innerHTML = '<p style="color:#e2d9d9; font-size: small; font-weight: bold">'+pcd[3]+' - '+pcd[2]+'</p>\
                                  <p style="color:#e2d9d9; font-size: small; font-weight: bold">'+pcd[7]+' - '+pcd[6]+'</p>\
                                  ' + htmlDados;
    }else {
       popupOnHoverAgro.setPosition(undefined);
       closerHoverAgro.blur();
    }
});
/*on hover*/

map3.on('pointermove', function (e) {
    var pixel = map3.getEventPixel(e.originalEvent);
    var hit = map3.hasFeatureAtPixel(pixel);
    var divTarget = document.getElementById(map3.getTarget());
    divTarget.style.cursor = hit ? 'pointer' : '';
});

$(document).ready(function () {
    findLayerAgro("inatividade_agro");
    findLayerAgro("ativa_agro");
    findLayerAgro("suspeita_agro");
    findLayerAgro("desabilitada_agro");    
});

function getStatusPcdsAgroMap(){
     $.ajax({
        async: true,
        global: false,        
//        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonStatusPcdsAgro",/*local cemaden*/
        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonStatusPcdsAgro",/*meu desk*/
//        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonStatusPcdsAgro",
        dataType: "json",
        cache: false,
        crossDomain: true,
        success: function (data) {
            lerArrayAgroInativas(data.AGRO_INATIVA);
            lerArrayAgroInativasTempo(data.AGRO_INATIVA);
            lerArrayAgroAtivas(data.AGRO_ATIVA);
            lerArrayAgroSuspeitas(data.AGRO_SUSPEITA);
            lerArrayAgroDesabilitadas(data.AGRO_DESABILITADA);
            map3.updateSize();
        }
    }); 
}

function getPcdsInativasOperadorasAgro(){
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
            lerArrayPcdsInativasOperadorasAgro(data.agro);            
            map3.updateSize();
        }
    }); 
}

layerAgroAtivas = new ol.layer.Group({layers: [], visible: false, name: 'ativa_agro'});
map3.addLayer(layerAgroAtivas);
function lerArrayAgroAtivas(evt){     
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatAgro(evt[pcd][4], evt[pcd][5]));
        createPinAgro(layerAgroAtivas, geom, evt[pcd], '#64e572', "pin_" + pcd);
    }    
};

layerAgroInativas = new ol.layer.Group({layers: [], visible: true, name: 'inatividade_agro'});
map3.addLayer(layerAgroInativas);
function lerArrayAgroInativas(evt){     
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatAgro(evt[pcd][4], evt[pcd][5]));
        createPinAgro(layerAgroInativas, geom, evt[pcd], '#f25d59', "pin_" + pcd);
    }    
};

layerAgroSuspeitas = new ol.layer.Group({layers: [], visible: false, name: 'suspeita_agro'});
map3.addLayer(layerAgroSuspeitas);
function lerArrayAgroSuspeitas(evt){
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatAgro(evt[pcd][4], evt[pcd][5]));
        createPinAgro(layerAgroSuspeitas, geom, evt[pcd], '#ff9500', "pin_" + pcd);
    }
};

layerAgroDesabilitada = new ol.layer.Group({layers: [], visible: false, name: 'desabilitada_agro'});
map3.addLayer(layerAgroDesabilitada);
function lerArrayAgroDesabilitadas(evt){
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatAgro(evt[pcd][4], evt[pcd][5]));
        createPinAgroDesabilitada(layerAgroDesabilitada, geom, evt[pcd], '#000000', "pin_" + pcd);
    }
};


layerAgroInativasTempo = new ol.layer.Group({layers: [], visible: false, name: 'inatividade_agro_tempo'});     
map3.addLayer(layerAgroInativasTempo);
function lerArrayAgroInativasTempo(evt){
    var a = 0, b = 0,c = 0,d = 0, e = 0, f = 0,g = 0,h = 0;
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatAgro(evt[pcd][4], evt[pcd][5]));        
        createPinAgro(layerAgroInativasTempo, geom, evt[pcd], inatividadeTempo(evt[pcd][8]), "pin_" + pcd);        
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
    legendAgroA.innerText = legendAgroA.textContent = '('+a+')';
    legendAgroB.innerText = legendAgroB.textContent = '('+b+')';
    legendAgroC.innerText = legendAgroC.textContent = '('+c+')';
    legendAgroD.innerText = legendAgroD.textContent = '('+d+')';
    legendAgroE.innerText = legendAgroE.textContent = '('+e+')';
    legendAgroF.innerText = legendAgroF.textContent = '('+f+')';
    legendAgroG.innerText = legendAgroG.textContent = '('+g+')';
    legendAgroH.innerText = legendAgroH.textContent = '('+h+')';
};

/*layer chips inativos por operadoras*/
layerPcdsInativasOperadoraVivoAgro = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_vivo_agro'});
layerPcdsInativasOperadoraClaroAgro = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_claro_agro'});
layerPcdsInativasOperadoraOiAgro = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_oi_agro'});
layerPcdsInativasOperadoraTimAgro = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_tim_agro'});
layerPcdsInativasOperadoraVodafoneAgro = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_vodafone_agro'});
layerPcdsInativasOperadoraNullAgro = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_null_agro'});

map3.addLayer(layerPcdsInativasOperadoraVivoAgro);
map3.addLayer(layerPcdsInativasOperadoraClaroAgro);
map3.addLayer(layerPcdsInativasOperadoraOiAgro);
map3.addLayer(layerPcdsInativasOperadoraTimAgro);
map3.addLayer(layerPcdsInativasOperadoraVodafoneAgro);
map3.addLayer(layerPcdsInativasOperadoraNullAgro);

function lerArrayPcdsInativasOperadorasAgro(evt){
    for (var pcd in evt) {
        if (evt[pcd][9] === 'Vivo') {
            var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
            createPinHidro(layerPcdsInativasOperadoraVivoAgro, geom, evt[pcd], '#9d4aea', "pin_" + pcd);
        }        
        if (evt[pcd][9] === 'Claro') {
            var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
            createPinHidro(layerPcdsInativasOperadoraClaroAgro, geom, evt[pcd], '#bc0000cf', "pin_" + pcd);
        }
        if (evt[pcd][9] === 'Oi') {
            var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
            createPinHidro(layerPcdsInativasOperadoraOiAgro, geom, evt[pcd], '#ffb100', "pin_" + pcd);
        }
        if (evt[pcd][9] === 'Tim') {
            var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
            createPinHidro(layerPcdsInativasOperadoraTimAgro, geom, evt[pcd], '#5151f0', "pin_" + pcd);
        }       
        if (evt[pcd][9] === 'Vodafone') {
            var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
            createPinHidro(layerPcdsInativasOperadoraTimAgro, geom, evt[pcd], '#ff0000', "pin_" + pcd);
        }
        if (evt[pcd][9] === null) {
            var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
            createPinHidro(layerPcdsInativasOperadoraNullAgro, geom, evt[pcd], '#22262e', "pin_" + pcd);
        }         
    }
};
/*layer chips inativos por operadoras*/

function getPointFromLongLatAgro(lat, long) {
    return ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857');
}

function  createPinAgro(arrLayers, geom, pcd, color, idPin) {
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


function  createPinAgroDesabilitada(arrLayers, geom, pcd, color, idPin) {
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


function findLayerAgro(value) {
    var layer = map3.getLayers();
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


var legendaAgroInatividade = document.getElementById("legenda-dias-inatividade-agro");
var clickInatividadeTempoAgro = document.getElementById("inatividade-tempo-agro");
clickInatividadeTempoAgro.onclick = function (e){
  e.preventDefault();
  legendaAgroInatividade.classList.toggle('display');
};

$('#overlayAgro li').click(function () {
    if ($(this).hasClass("sub-menu")) {
        var currentLayer = $(this).closest("[data-layer]").data("layer");        
        
        if (currentLayer === 'ativa_agro') {
            if ($(this).hasClass("mark_selected_ativas")) {
                $(this).removeClass("mark_selected_ativas");
                setLayerVisibleAgro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_ativas");
                setLayerVisibleAgro(currentLayer, true);
            }
        }        
        if (currentLayer === 'inatividade_agro') {
            if ($(this).hasClass("mark_selected_inativas")) {
                $(this).removeClass("mark_selected_inativas");
                setLayerVisibleAgro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_inativas");
                setLayerVisibleAgro(currentLayer, true);
            }
        }
        if (currentLayer === 'inatividade_agro_tempo') {
            if ($(this).hasClass("mark_selected_inatividade_tempo_agro")) {
                $(this).removeClass("mark_selected_inatividade_tempo_agro");
                setLayerVisibleAgro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_inatividade_tempo_agro");
                setLayerVisibleAgro(currentLayer, true);
            }
        }        
        if (currentLayer === 'suspeita_agro') {
            if ($(this).hasClass("mark_selected_suspeita")) {
                $(this).removeClass("mark_selected_suspeita");
                setLayerVisibleAgro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_suspeita");
                setLayerVisibleAgro(currentLayer, true);
            }
        }
        if (currentLayer === 'desabilitada_agro') {
            if ($(this).hasClass("mark_selected_desabilitada")) {
                $(this).removeClass("mark_selected_desabilitada");
                setLayerVisibleAgro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_desabilitada");
                setLayerVisibleAgro(currentLayer, true);
            }
        }                
        
        /*operadoras*/
        
        //vodafone-AGRO
        if (currentLayer === 'chip_inativo_vodafone_agro') {
            if ($(this).hasClass("mark_selected_chip_inativo_vodafone_agro")) {
                $(this).removeClass("mark_selected_chip_inativo_vodafone_agro");
                setLayerVisibleAgro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_vodafone_agro");
                setLayerVisibleAgro(currentLayer, true);
            }
        }
        
        //Oi-AGRO
        if (currentLayer === 'chip_inativo_oi_agro') {
            if ($(this).hasClass("mark_selected_chip_inativo_oi_agro")) {
                $(this).removeClass("mark_selected_chip_inativo_oi_agro");
                setLayerVisibleAgro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_oi_agro");
                setLayerVisibleAgro(currentLayer, true);
            }
        }
        
        //vivo-AGRO
        if (currentLayer === 'chip_inativo_vivo_agro') {
            if ($(this).hasClass("mark_selected_chip_inativo_vivo_agro")) {
                $(this).removeClass("mark_selected_chip_inativo_vivo_agro");
                setLayerVisibleAgro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_vivo_agro");
                setLayerVisibleAgro(currentLayer, true);
            }
        }
        
        //claro-AGRO        
        if (currentLayer === 'chip_inativo_claro_agro') {
            if ($(this).hasClass("mark_selected_chip_inativo_claro_agro")) {
                $(this).removeClass("mark_selected_chip_inativo_claro_agro");
                setLayerVisibleAgro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_claro_agro");
                setLayerVisibleAgro(currentLayer, true);
            }
        }
        
        //tim-AGRO        
        if (currentLayer === 'chip_inativo_tim_agro') {
            if ($(this).hasClass("mark_selected_chip_inativo_tim_agro")) {
                $(this).removeClass("mark_selected_chip_inativo_tim_agro");
                setLayerVisibleAgro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_tim_agro");
                setLayerVisibleAgro(currentLayer, true);
            }
        }       
        
        //sem chip-AGRO
        if (currentLayer === 'chip_inativo_null_agro') {
            if ($(this).hasClass("mark_selected_chip_inativo_null_agro")) {
                $(this).removeClass("mark_selected_chip_inativo_null_agro");
                setLayerVisibleAgro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_null_agro");
                setLayerVisibleAgro(currentLayer, true);
            }
        }
        /*operadoras*/
                        
        if (currentLayer === 'area_risco_sem_indice_agro') {
            if ($(this).hasClass("mark_selected_risco_sem_indice_agro")) {
                $(this).removeClass("mark_selected_risco_sem_indice_agro");
                setLayerVisibleAgro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_risco_sem_indice_agro");
                setLayerVisibleAgro(currentLayer, true);
            }
        }        
        if (currentLayer === 'risco_hidrologico_agro') {
            if ($(this).hasClass("mark_selected_risco_hidro_agro")) {
                $(this).removeClass("mark_selected_risco_hidro_agro");
                setLayerVisibleAgro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_risco_hidro_agro");
                setLayerVisibleAgro(currentLayer, true);
            }
        }   
        if (currentLayer === 'risco_geologico_agro') {
            if ($(this).hasClass("mark_selected_risco_geologico_agro")) {
                $(this).removeClass("mark_selected_risco_geologico_agro");
                setLayerVisibleAgro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_risco_geologico_agro");
                setLayerVisibleAgro(currentLayer, true);
            }
        }        
    } else {
        var currentParent = $(this).closest("[data-parent]").data("parent");
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $('#overlayAgro li[data-parent="' + currentParent + '"]').removeClass('menu-unfold');
        } else {
            $(this).addClass("selected");
            $('#overlayAgro li[data-parent="' + currentParent + '"]').addClass('menu-unfold');
        }
    }
}
);

function setLayerVisibleAgro(index, value) {
    var layerAgro = findLayerAgro(index);
    layerAgro.setVisible(value);
}