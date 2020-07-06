/**
 * @author marcus.costa
 * @param {type} dataUltimaConexao
 * @returns {String}
 * 19/06/2019
 */

function inatividadeTempo(dataUltimaConexao) { /*retorna a cor que corresponde aos dias inativos*/
    var dataAnterior = Date.parse(dataUltimaConexao), dataConvertida = new Date(dataAnterior), dataAtual = new Date();
    var diff = dataAtual.getTime() - dataConvertida.getTime();
    var diasInativiadade = parseInt(diff / (1000 * 60 * 60 * 24));    

    if (diasInativiadade === 0) {
        return "#9b9b9b";
    }
    if (diasInativiadade >= 1 && diasInativiadade <= 30) {
        return "#fff900";
    }
    if (diasInativiadade >= 31 && diasInativiadade <= 60) {
        return "#ffc700";
    }
    if (diasInativiadade >= 61 && diasInativiadade <= 90) {
        return "#ff8300";
    }
    if (diasInativiadade >= 91 && diasInativiadade <= 300) {
        return "#f75718";
    }
    if (diasInativiadade >= 301 && diasInativiadade <= 600) {
        return "#FF0000";
    }
    if (diasInativiadade > 600) {
        return "#990000	";
    }
};

/**
 * 
 * @param {type} dataUltimaConexao
 * @returns {qtdDiasInatividade.diasInativiadade}
 */
function qtdDiasInatividade(dataUltimaConexao) {
    if (dataUltimaConexao !== "null") {
        var dataAnterior = Date.parse(dataUltimaConexao), dataConvertida = new Date(dataAnterior), dataAtual = new Date();
        var diff = dataAtual.getTime() - dataConvertida.getTime();
        var diasInativiadade = parseInt(diff / (1000 * 60 * 60 * 24));
        return  diasInativiadade;
    }
    return null;
}