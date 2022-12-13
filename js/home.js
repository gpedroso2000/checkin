// OBJETO GLOBAL
var objHome = {
  ACAO      : 'INCLUIR',
  docAntigo : ''
}

// CADASTROS
var objPessoa = [ {
    nome      : 'Gustavo Santos',
    documento : '87545248745',
    telefone  : '11945725841',
  },
  {
    nome      : 'Guilherme Reinaldo',
    documento : '87545221565',
    telefone  : '11987528425',
  },
  {
    nome      : 'Pedro Guilherme',
    documento : '87515001515',
    telefone  : '11987521541',
  }
]

var objCheckin = [{
    pessoa        : objPessoa[0],
    dataEntrada   : '2022-12-01T01:35:10',
    dataSaida     : '2022-12-07T21:35:25',
    veiculo       : true,
  },
  {
    pessoa        : objPessoa[1],
    dataEntrada   : '2022-12-01T01:35:15',
    dataSaida     : '',
    veiculo       : false,
  },
  {
    pessoa        : objPessoa[2],
    dataEntrada   : '2022-11-01T09:35:45',
    dataSaida     : '2022-11-15T18:00:01',
    veiculo       : true,
  }

];

$(window).on("load", function(){
    home_inicial();
 }); 

function home_inicial(){
  home_carregaSelectPessoa();
  home_carregaGridConsulta('ALL');
}

function home_carregaGridPessoa() {
  home_limparInputsCadastroPessoa();
  objHome.ACAO = 'INCLUIR';
  objHome.docAntigo = '';
  $('#gridPessoa').html('');

  var cHtml = '';
  
  if(objPessoa.length == 0){
    cHtml = ` <tr class="align-middle">
                <td  class="text-center fw-bold" colspan="5">Não há itens a serem exibidos</td>
              </tr>`     
  }
  else{
    objPessoa.forEach(pessoa => {
      var tr = ` <tr class="align-middle">
                  <td>${pessoa.nome}</td>
                  <td>${pessoa.documento}</td>
                  <td>${pessoa.telefone}</td>
                  <td><a class="btn btn-primary" onclick="home_editarPessoa('${pessoa.documento}')">Editar</a></td>
                  <td><a class="btn btn-danger"onclick="home_excluirPessoa('${pessoa.documento}')">Excluir</a></td>
                </tr>`
      cHtml +=  tr;        
    })
  }

  $('#gridPessoa').append(cHtml);
}

function home_editarPessoa(documento) {
  objHome.docAntigo = documento;
  objHome.ACAO = 'ALTERAR';

  var retorno = objPessoa.filter(pessoa=>{
                    if(pessoa.documento == documento){
                        return pessoa;
                    }
                  });

  $('#cadastroNome').val(retorno[0].nome);
  $('#cadastroDocumento').val(retorno[0].documento);
  $('#cadastroTelefone').val(retorno[0].telefone);
}

function home_excluirPessoa(documento) {

  var retorno = objPessoa.filter(pessoa=>{
                    if(pessoa.documento !== documento){
                        return pessoa;
                    }
                  });
  objPessoa = [...retorno];     
  
  home_limparInputsCadastroPessoa();
  home_carregaGridPessoa();
  home_inicial();
}

function home_salvarPessoa(){
  var nome = $('#cadastroNome').val();
  var doc  = $('#cadastroDocumento').val();
  var tel  = $('#cadastroTelefone').val();
  var lOk  = true;

  // validar campos
  objPessoa.forEach(data=>{
    if(data.documento == doc){
      lOk = false;
    }
  })

  if(!lOk){
    toastr.warning('O documento digitado já está cadastrado!')
    return;
  }

  if(!nome){
    $('#cadastroNome').addClass('obrigatorio')
    $($('#cadastroNome').siblings()[1]).show()
    lOk = false;
    
  }
  if(!doc){
    $('#cadastroDocumento').addClass('obrigatorio')
    $($('#cadastroDocumento').siblings()[1]).show()
    lOk = false;
  }

  if(!lOk){
    setTimeout(()=>{
      $('#cadastroNome').removeClass('obrigatorio')
      $($('#cadastroNome').siblings()[1]).hide() 

      $('#cadastroDocumento').removeClass('obrigatorio')
      $($('#cadastroDocumento').siblings()[1]).hide()
    }, 1000)
    return;
  }


  if(objHome.ACAO == 'ALTERAR'){
    objPessoa.forEach(pessoa=>{
      if(pessoa.documento == objHome.docAntigo){
        pessoa.nome       = nome;
        pessoa.documento  = doc;
        pessoa.telefone   = tel;
      }
    });
  }
  else if(objHome.ACAO == 'INCLUIR'){
  
    var newPessoa =   { nome      : nome,  
                        documento : doc,
                        telefone  : tel,
                      }
    objPessoa.push(newPessoa);     
  }

 
  home_limparInputsCadastroPessoa();
  home_carregaGridPessoa();
  home_inicial();
}

function home_carregaSelectPessoa() {
  var option = '<option value=""></option>'
  objPessoa.forEach(pessoa => {
    option += `<option value="${pessoa.nome}|${pessoa.documento}|${pessoa.telefone}">${pessoa.nome} - Doc: ${pessoa.documento}  </option>`
  })  

  $('#pessoa').html(option)
}

function home_limparInputsCadastroPessoa(){
  $('#cadastroNome').val('') 
  $('#cadastroDocumento').val('')
  $('#cadastroTelefone').val('')
} 

function home_carregaGridConsulta(parametroFiltro) {
  $('#gridConsultas').html('');

  var cHtml = '';
  var filtro = [];


  if(objCheckin.length > 0){
    objCheckin.forEach((checkin, index) => {
       var valGasto      =   home_calculaValorGasto(checkin.dataEntrada, checkin.dataSaida, checkin.veiculo);
       objCheckin[index] = {...checkin, gastos: valGasto}
    })
  }
  
  if(objCheckin.length == 0){
    cHtml = ` <tr class="align-middle">
                <td  class="text-center fw-bold" colspan="5">Não há itens a serem exibidos</td>
              </tr>`     
  }else if(objCheckin.length > 0 && parametroFiltro == "naoPresente"){
    filtro = objCheckin.filter(checkin =>{
        if(checkin.dataSaida){
            return checkin;
        }
    })
  }else if(objCheckin.length > 0 && parametroFiltro == "presente"){
    filtro = objCheckin.filter(checkin =>{
      if(!checkin.dataSaida){
          return checkin;
      }
    })
  }
  else if(objCheckin.length > 0 && parametroFiltro == "ALL"){
    filtro = [...objCheckin]
  }
    filtro.forEach(checkin => {
      var tr = ` <tr class="align-middle">
                  <td>${checkin.pessoa.nome}</td>
                  <td>${checkin.pessoa.documento}</td>
                  <td>${checkin.gastos.toFixed(2)}</td>
                </tr>`
      cHtml +=  tr;        
    })
  

  $('#gridConsultas').append(cHtml);
}

function home_salvarCheckin(){
  var dtEnt_ISO     = moment($('#dhEntrada').val().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})).format().substr(0, 19);
  var dtSai         = $('#dhSaida').val();
  var nome          = $('#pessoa').val().split('|')[0];
  var doc           = $('#pessoa').val().split('|')[1];
  var tel           = $('#pessoa').val().split('|')[2];
  var veic          = document.getElementById('veiculo').checked;
  var lOk           = true;

  if(!dtEnt_ISO || dtEnt_ISO == 'Invalid date'){
    $('#dhEntrada').addClass('obrigatorio')
    $($('#dhEntrada').siblings()[1]).show()
    lOk = false;
    
  }
  if(!nome){
    $('#pessoa').addClass('obrigatorio')
    $($('#pessoa').siblings()[1]).show()
    lOk = false;
  }

  if(!lOk){
    setTimeout(()=>{
      $('#dhEntrada').removeClass('obrigatorio')
      $($('#dhEntrada').siblings()[1]).hide() 

      $('#pessoa').removeClass('obrigatorio')
      $($('#pessoa').siblings()[1]).hide()
    }, 1000)
    return;
  }

  var newPessoa  = {
    nome      : nome,
    documento : doc,
    telefone  : tel,
  }
  
  var newCheckin = {
    pessoa     : newPessoa,
    dataEntrada: dtEnt_ISO,
    dataSaida  : dtSai,
    veiculo    : veic,
  }
  
  objCheckin.push(newCheckin);

  $('#dhEntrada').val('');
  $('#dhSaida').val('');
  $('#pessoa').val('');

  document.getElementById('todos').checked = true;
  home_carregaGridConsulta('ALL');
}

function home_calculaValorGasto(dataEntrada, dataSaida, veiculo){
  var dtEntFormat = moment(dataEntrada,'YYYY-MM-DDThh:mm:ss').format('DD/MM/YYYY');
  var dtSaiFormat = dataSaida ? moment(dataSaida,'YYYY-MM-DDThh:mm:ss').format('DD/MM/YYYY') : moment().format('DD/MM/YYYY');
  var valGasto    = 0
  var lpassou     = false;
  var diaSemEnt;
  

  if(dtEntFormat == dtSaiFormat){
    diaSemEnt     = moment(dtEntFormat, 'DD/MM/YYYY').format('llll').substr(0, 3);
    lpassou       = true;

    if(diaSemEnt == 'Sat' || diaSemEnt == 'Sun'){
      valGasto += 150.00
      valGasto += veiculo ? 20.00 : 0;
    }
    else{
      valGasto += 120.00
      valGasto += veiculo ? 15.00 : 0;
    }
  }
 
  while(dtEntFormat < dtSaiFormat){
    diaSemEnt     = moment(dtEntFormat, 'DD/MM/YYYY').format('llll').substr(0, 3);

    if(diaSemEnt == 'Sat' || diaSemEnt == 'Sun'){
      valGasto += 150.00
      valGasto += veiculo ? 20.00 : 0;
    }
    else{
      valGasto += 120.00
      valGasto += veiculo ? 15.00 : 0;
    }
    dtEntFormat   = moment(dtEntFormat, 'DD/MM/YYYY').add(1, 'days').format('DD/MM/YYYY');
  }

  if(dtEntFormat == dtSaiFormat && !lpassou){

    dataSaida       = dataSaida ? dataSaida : moment().format('YYYY-MM-DDThh:mm:ss');
    var hora        = moment(dataSaida).hour();
    var minutos     = moment(dataSaida).minute();
    var diariaExtra = false;
    var diaSemSaida = moment(dtSaiFormat, 'DD/MM/YYYY').format('llll').substr(0, 3);

    if(hora == 16 && minutos > 30){
      diariaExtra = true;
    }
    else if(hora > 16){
      diariaExtra = true;
    }

    if(diariaExtra){
      if(diaSemSaida == 'Sat' || diaSemSaida == 'Sun'){
        valGasto += 150.00
        valGasto += veiculo ? 20.00 : 0;
      }
      else{
        valGasto += 120.00
        valGasto += veiculo ? 15.00 : 0;
      } 
    }
  }

  return valGasto;
}

