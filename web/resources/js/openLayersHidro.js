/* global ol */

var arrLayersHidro = [];
// MAPA
arrLayersHidro[0] = new ol.layer.Tile({
    title: "PCD's Hidrologicas",
//    source: new ol.source.OSM()
    source: new ol.source.XYZ({url: "http://virt142.cemaden.gov.br/osm_tiles/{z}/{x}/{y}.png"})
});

// Estados
arrLayersHidro[1] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:br_estados', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'brEstados',
    zIndex: 10
});

//área de risco sem indice
arrLayersHidro[2] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:areasrisco_inov_sem_indice', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'area_risco_sem_indice_hidro',
    visible: false
});


//risco hidro
arrLayersHidro[3] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:risco_hidro_uf', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'risco_hidrologico_hidro',
    visible: false
});

/*risco geológico*/
arrLayersHidro[4] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:movimento_massa_uf', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'risco_geologico_hidro',
    visible: false
});



//bacias - hidrologia
arrLayersHidro[5] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://172.16.42.231:8080/geoserver/cemaden_dev/wms',
        params: {'LAYERS': 'cemaden_dev:CPRM', 'TILED': true},
        serverType: 'geoserver'
    }),
    name: 'camada_bacias_hidrologicas',
    visible: false
});


/*Construção do mapa*/
var map4 = new ol.Map({
    target: 'map4',
    controls: ol.control.defaults().extend([
//                    new ol.control.FullScreen()                    
    ]),     
    layers: arrLayersHidro,
    view: new ol.View({       
        center: ol.proj.fromLonLat([-55, -10]),
        zoom: 4
    })
});

var legendHidroA = document.getElementById("inatividade-h0");
var legendHidroB = document.getElementById("inatividade-h1");
var legendHidroC = document.getElementById("inatividade-h2");
var legendHidroD = document.getElementById("inatividade-h3");
var legendHidroE = document.getElementById("inatividade-h4");
var legendHidroF = document.getElementById("inatividade-h5");
var legendHidroG = document.getElementById("inatividade-h6");
var legendHidroH = document.getElementById("inatividade-h7");

//onClick
var containerHidro = document.getElementById('popup-hidro');
var contentHidro = document.getElementById('popup-content-hidro');
var closerHidro = document.getElementById('popup-closer-hidro');

var popupOnclickHidro = new ol.Overlay({
    element: containerHidro,
    positioning: 'bottom-center',
    stopEvent: false,
    autoPan: true,
    offset: [0, -20]
});

map4.addOverlay(popupOnclickHidro);
closerHidro.onclick = function () {
    popupOnclickHidro.setPosition(undefined);
    closerHidro.blur();
    return false;
};

map4.on('click', function (evt) {
    var feature = map4.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });

    if (feature) {
        popupOnHoverHidro.setPosition(undefined);
        closerHoverHidro.blur();
        var coordinates = feature.getGeometry().getCoordinates();
        popupOnclickHidro.setPosition(coordinates);
         var pcd = feature.get('pcd');
        var date = new Date(pcd[8]).toLocaleString('pt-BR');       
        var htmlDados = "";

        for (var dado in pcd.dados) { 
            htmlDados = htmlDados.concat('<p style="color:#e2d9d9; font-size: small"><strong>IdPcd: </strong>' + pcd.dados[dado].idPcd + ' <br>\n\<br>');
        }
        contentHidro.innerHTML = '<p style="color:#e2d9d9; font-size: small"><strong>Estacao: </strong>' + pcd[3] + '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Nome: </strong>' + pcd[2] + '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Operadora: </strong>' +pcd[9]+' - '+pcd[10]+ '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Última Conexão: </strong>' + date + '</p>\n\
                             <p style="color:#e2d9d9; font-size: small"><strong>Dias de Inatividade: </strong>' + qtdDiasInatividade(pcd[8])+ '</p>\n\
                             <p style="color:#e2d9d9; font-size: inherit; text-decoration: underline; font-weight: bold "><a target="_blank" href="http://sjc.salvar.cemaden.gov.br/resources/graficos/cemaden/hidro/hidrologica_interativo.html?est='+pcd[1]+'&uf='+pcd[6]+'">Link Mapa Interativo</a></p>\n\
                             </p>' + htmlDados;
    } else {
        popupOnclickHidro.setPosition(undefined);
        closerHidro.blur();
    }
});
//onClick

//onHover
var containerHoverHidro = document.getElementById('popup-hover-hidro');
var closerHoverHidro = document.getElementById('popup-closer-hover-hidro');
var hoverInfoHidro = document.getElementById('infoPcdHidro');

var popupOnHoverHidro = new ol.Overlay({
    element: containerHoverHidro,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -20]
});

map4.addOverlay(popupOnHoverHidro);
closerHoverHidro.onclick = function () {
    popupOnHoverHidro.setPosition(undefined);
    closerHoverHidro.blur();
    return false;
};

map4.on('pointermove', function (evt) {
    var feature_onHover = map4.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });
    
    if (feature_onHover) {
        var coordinates = feature_onHover.getGeometry().getCoordinates();
        popupOnHoverHidro.setPosition(coordinates);
        var pcd = feature_onHover.get('pcd');
        var htmlDados = "";
        hoverInfoHidro.innerHTML = '<p style="color:#e2d9d9; font-size: small; font-weight: bold">'+pcd[3]+' - '+pcd[2]+'</p>\
                                  <p style="color:#e2d9d9; font-size: small; font-weight: bold">'+pcd[7]+' - '+pcd[6]+'</p>\
                                  ' + htmlDados;
    }else {
       popupOnHoverHidro.setPosition(undefined);
       closerHoverHidro.blur();
    }
});
//onHover

map4.on('pointermove', function (e) {
    var pixel = map4.getEventPixel(e.originalEvent);
    var hit = map4.hasFeatureAtPixel(pixel);
    var divTarget = document.getElementById(map4.getTarget());
    divTarget.style.cursor = hit ? 'pointer' : '';
});

$(document).ready(function () {
    findLayerHidro("inatividade_hidro");
    findLayerHidro("ativa_hidro");
    findLayerHidro("suspeita_hidro");
    findLayerHidro("desabilitada_hidro");    
    
});

function getStatusPcdsHidroMap(){
     $.ajax({
        async: true,
        global: false,        
        url: "http://localhost:8081/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonStatusPcdsHidro",/*local cemaden*/
//        url: "http://localhost:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonStatusPcdsHidro",/*meu desk*/
//        url: "http://engenharia.cemaden.gov.br:8080/DashboardWS-1.0-SNAPSHOT/rest/message/getJsonStatusPcdsHidro",
        dataType: "json",
        cache: false,
        crossDomain: true,
        success: function (data) {
            lerArrayHidroInativas(data.HIDRO_INATIVA);
            lerArrayHidroInativasTempo(data.HIDRO_INATIVA);
            lerArrayHidroAtivas(data.HIDRO_ATIVA);
            lerArrayHidroSuspeitas(data.HIDRO_SUSPEITA);
            lerArrayHidroDesabilitadas(data.HIDRO_DESABILITADA); 
            map4.updateSize();
      }
    }); 
}

function getPcdsInativasOperadorasHidro(){
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
            lerArrayPcdsInativasOperadorasHidro(data.hidro);            
            map4.updateSize();
        }
    }); 
}

layerHidroInativa = new ol.layer.Group({layers: [], visible: true, name: 'inatividade_hidro'});
map4.addLayer(layerHidroInativa);
function lerArrayHidroInativas(evt){
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
        createPinHidro( layerHidroInativa, geom, evt[pcd], '#f25d59', "pin_" + pcd);
    } 
};

layerHidroAtivas = new ol.layer.Group({layers: [], visible: false, name: 'ativa_hidro'});    
map4.addLayer(layerHidroAtivas);
function lerArrayHidroAtivas(evt){   
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
        createPinHidro(layerHidroAtivas, geom, evt[pcd], '#64e572', "pin_" + pcd);
    }
};

layerHidroSuspeitas = new ol.layer.Group({layers: [], visible: false, name: 'suspeita_hidro'});
map4.addLayer(layerHidroSuspeitas);
function lerArrayHidroSuspeitas(evt){    
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
        createPinHidro(layerHidroSuspeitas, geom, evt[pcd], '#ff9500', "pin_" + pcd);
    }       
};

layerHidroDesabilitada = new ol.layer.Group({layers: [], visible: false, name: 'desabilitada_hidro'});
map4.addLayer(layerHidroDesabilitada);
function lerArrayHidroDesabilitadas(evt){
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
        createPinHidroDesabilitada(layerHidroDesabilitada, geom, evt[pcd], '#000000', "pin_" + pcd);
    }
};


layerHidroInativasTempo = new ol.layer.Group({layers: [], visible: false, name: 'inatividade_hidro_tempo'});     
map4.addLayer(layerHidroInativasTempo);
function lerArrayHidroInativasTempo(evt){
    var a = 0, b = 0,c = 0,d = 0, e = 0, f = 0,g = 0,h = 0;
    for (var pcd in evt) {
        var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));        
        createPinHidro(layerHidroInativasTempo, geom, evt[pcd], inatividadeTempo(evt[pcd][8]), "pin_" + pcd);        
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
    legendHidroA.innerText = legendHidroA.textContent = '('+a+')';
    legendHidroB.innerText = legendHidroB.textContent = '('+b+')';
    legendHidroC.innerText = legendHidroC.textContent = '('+c+')';
    legendHidroD.innerText = legendHidroD.textContent = '('+d+')';
    legendHidroE.innerText = legendHidroE.textContent = '('+e+')';
    legendHidroF.innerText = legendHidroF.textContent = '('+f+')';
    legendHidroG.innerText = legendHidroG.textContent = '('+g+')';
    legendHidroH.innerText = legendHidroH.textContent = '('+h+')';
};

/*layer chips inativos por operadoras*/
layerPcdsInativasOperadoraVivoHidro = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_vivo_hidro'});
layerPcdsInativasOperadoraClaroHidro = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_claro_hidro'});
layerPcdsInativasOperadoraOiHidro = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_oi_hidro'});
layerPcdsInativasOperadoraTimHidro = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_tim_hidro'});
layerPcdsInativasOperadoraVodafoneHidro = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_vodafone_hidro'});
layerPcdsInativasOperadoraNullHidro = new ol.layer.Group({layers: [], visible: false, name: 'chip_inativo_null_hidro'});

map4.addLayer(layerPcdsInativasOperadoraVivoHidro);
map4.addLayer(layerPcdsInativasOperadoraClaroHidro);
map4.addLayer(layerPcdsInativasOperadoraOiHidro);
map4.addLayer(layerPcdsInativasOperadoraTimHidro);
map4.addLayer(layerPcdsInativasOperadoraVodafoneHidro);
map4.addLayer(layerPcdsInativasOperadoraNullHidro);

function lerArrayPcdsInativasOperadorasHidro(evt){
    for (var pcd in evt) {
        if (evt[pcd][9] === 'Vivo') {
            var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
            createPinHidro(layerPcdsInativasOperadoraVivoHidro, geom, evt[pcd], '#9d4aea', "pin_" + pcd);
        }        
        if (evt[pcd][9] === 'Claro') {
            var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
            createPinHidro(layerPcdsInativasOperadoraClaroHidro, geom, evt[pcd], '#bc0000cf', "pin_" + pcd);
        }
        if (evt[pcd][9] === 'Oi') {
            var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
            createPinHidro(layerPcdsInativasOperadoraOiHidro, geom, evt[pcd], '#ffb100', "pin_" + pcd);
        }
        if (evt[pcd][9] === 'Tim') {
            var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
            createPinHidro(layerPcdsInativasOperadoraTimHidro, geom, evt[pcd], '#5151f0', "pin_" + pcd);
        }       
        if (evt[pcd][9] === 'Vodafone') {
            var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
            createPinHidro(layerPcdsInativasOperadoraTimHidro, geom, evt[pcd], '#ff0000', "pin_" + pcd);
        }
        if (evt[pcd][9] === null) {
            var geom = new ol.geom.Point(getPointFromLongLatHidro(evt[pcd][4], evt[pcd][5]));
            createPinHidro(layerPcdsInativasOperadoraNullHidro, geom, evt[pcd], '#22262e', "pin_" + pcd);
        }         
    }
};
/*layer chips inativos por operadoras*/

function getPointFromLongLatHidro(lat, long) {
    return ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857');
}

function  createPinHidro(arrLayers, geom, pcd, color, idPin) {
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

function  createPinHidroDesabilitada(arrLayers, geom, pcd, color, idPin) {
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

function findLayerHidro(value) {
    var layer = map4.getLayers();
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

var legendaHidroInatividade = document.getElementById("legenda-dias-inatividade-hidro");
var clickInatividadeTempoHidro = document.getElementById("inatividade-tempo-hidro");
clickInatividadeTempoHidro.onclick = function (e){
  e.preventDefault();
  legendaHidroInatividade.classList.toggle('display');
};

$('#overlayHidro li').click(function () {
    if ($(this).hasClass("sub-menu")) {
        var currentLayer = $(this).closest("[data-layer]").data("layer");
        if (currentLayer === 'ativa_hidro') {
            if ($(this).hasClass("mark_selected_ativas")) {
                $(this).removeClass("mark_selected_ativas");
                setLayerVisibleHidro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_ativas");
                setLayerVisibleHidro(currentLayer, true);
            }
        }        
        if (currentLayer === 'inatividade_hidro') {
            if ($(this).hasClass("mark_selected_inativas")) {
                $(this).removeClass("mark_selected_inativas");
                setLayerVisibleHidro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_inativas");
                setLayerVisibleHidro(currentLayer, true);
            }
        }  
        if (currentLayer === 'inatividade_hidro_tempo') {
            if ($(this).hasClass("mark_selected_inatividade_tempo_hidro")) {
                $(this).removeClass("mark_selected_inatividade_tempo_hidro");
                setLayerVisibleHidro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_inatividade_tempo_hidro");
                setLayerVisibleHidro(currentLayer, true);
            }
        }        
        if (currentLayer === 'suspeita_hidro') {
            if ($(this).hasClass("mark_selected_suspeita")) {
                $(this).removeClass("mark_selected_suspeita");
                setLayerVisibleHidro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_suspeita");
                setLayerVisibleHidro(currentLayer, true);
            }
        }        
        if (currentLayer === 'desabilitada_hidro') {
            if ($(this).hasClass("mark_selected_desabilitada")) {
                $(this).removeClass("mark_selected_desabilitada");
                setLayerVisibleHidro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_desabilitada");
                setLayerVisibleHidro(currentLayer, true);
            }
        }  
        
         /*operadoras*/
        
        //vodafone-HIDRO
        if (currentLayer === 'chip_inativo_vodafone_hidro') {
            if ($(this).hasClass("mark_selected_chip_inativo_vodafone_hidro")) {
                $(this).removeClass("mark_selected_chip_inativo_vodafone_hidro");
                setLayerVisibleHidro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_vodafone_hidro");
                setLayerVisibleHidro(currentLayer, true);
            }
        }
        
        //Oi-HIDRO
        if (currentLayer === 'chip_inativo_oi_hidro') {
            if ($(this).hasClass("mark_selected_chip_inativo_oi_hidro")) {
                $(this).removeClass("mark_selected_chip_inativo_oi_hidro");
                setLayerVisibleHidro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_oi_hidro");
                setLayerVisibleHidro(currentLayer, true);
            }
        }
        
        //vivo-HIDRO
        if (currentLayer === 'chip_inativo_vivo_hidro') {
            if ($(this).hasClass("mark_selected_chip_inativo_vivo_hidro")) {
                $(this).removeClass("mark_selected_chip_inativo_vivo_hidro");
                setLayerVisibleHidro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_vivo_hidro");
                setLayerVisibleHidro(currentLayer, true);
            }
        }
        
        //claro-HIDRO        
        if (currentLayer === 'chip_inativo_claro_hidro') {
            if ($(this).hasClass("mark_selected_chip_inativo_claro_hidro")) {
                $(this).removeClass("mark_selected_chip_inativo_claro_hidro");
                setLayerVisibleHidro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_claro_hidro");
                setLayerVisibleHidro(currentLayer, true);
            }
        }
        
        //tim-HIDRO        
        if (currentLayer === 'chip_inativo_tim_hidro') {
            if ($(this).hasClass("mark_selected_chip_inativo_tim_hidro")) {
                $(this).removeClass("mark_selected_chip_inativo_tim_hidro");
                setLayerVisibleHidro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_tim_hidro");
                setLayerVisibleHidro(currentLayer, true);
            }
        }
        
        //sem chip-HIDRO        
        if (currentLayer === 'chip_inativo_null_hidro') {
            if ($(this).hasClass("mark_selected_chip_inativo_null_hidro")) {
                $(this).removeClass("mark_selected_chip_inativo_null_hidro");
                setLayerVisibleHidro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_chip_inativo_null_hidro");
                setLayerVisibleHidro(currentLayer, true);
            }
        }
        
        /*operadoras*/
        
        if (currentLayer === 'area_risco_sem_indice_hidro') {
            if ($(this).hasClass("mark_selected_risco_sem_indice_hidro")) {
                $(this).removeClass("mark_selected_risco_sem_indice_hidro");
                setLayerVisibleHidro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_risco_sem_indice_hidro");
                setLayerVisibleHidro(currentLayer, true);
            }
        }        
        if (currentLayer === 'risco_hidrologico_hidro') {
            if ($(this).hasClass("mark_selected_risco_hidro_hidro")) {
                $(this).removeClass("mark_selected_risco_hidro_hidro");
                setLayerVisibleHidro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_risco_hidro_hidro");
                setLayerVisibleHidro(currentLayer, true);
            }
        }            
        if (currentLayer === 'risco_geologico_hidro') {
            if ($(this).hasClass("mark_selected_risco_geologico_hidro")) {
                $(this).removeClass("mark_selected_risco_geologico_hidro");
                setLayerVisibleHidro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_risco_geologico_hidro");
                setLayerVisibleHidro(currentLayer, true);
            }
        }        
        if (currentLayer === 'camada_bacias_hidrologicas') {
            if ($(this).hasClass("mark_selected_cprm")) {
                $(this).removeClass("mark_selected_cprm");
                setLayerVisibleHidro(currentLayer, false);
            } else {
                $(this).addClass("mark_selected_cprm");
                setLayerVisibleHidro(currentLayer, true);
            }
        }                
    } else {
        var currentParent = $(this).closest("[data-parent]").data("parent");
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $('#overlayHidro li[data-parent="' + currentParent + '"]').removeClass('menu-unfold');
        } else {
            $(this).addClass("selected");
            $('#overlayHidro li[data-parent="' + currentParent + '"]').addClass('menu-unfold');
        }
    }
}
);

function setLayerVisibleHidro(index, value) {
    var layerHidro = findLayerHidro(index);    
    layerHidro.setVisible(value);    
}