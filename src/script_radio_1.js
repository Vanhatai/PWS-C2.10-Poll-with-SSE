$('.message').hide();
$('.results').hide();

$('.view-btn').click(() => {
	$('.results').show();
	$('.message').hide();
});

let pet;

$("input[name='optradio']").change (function() {
    pet = $('input[name=optradio]:checked').val();
});

console.log(pet);

$('.vote-btn').click(() => {
    if(pet === undefined) alert("Вы не выбрали животное");
    else postVote(pet);
});
    


function postVote(pet) {
	$.post(`https://sf-pyw.mosyag.in//sse/vote/${pet}`, function(data) {
		if(data.message == "Ok") $('.message').show();	
		});
    $('.poll').hide();
}

const header = new Headers({
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*'
})

const url = new URL('https://sf-pyw.mosyag.in/sse/vote/stats')
const ES = new EventSource(url, header)

ES.onerror = error => {
    ES.readyState ? $('.results').html("<h3>Some error</h3>") : null;
}

ES.onmessage = message => {
    results = JSON.parse(message.data)
    sum = results.cats + results.dogs + results.parrots;
    console.log('Всего голосов', sum);
    console.log(message.data);
    catsShare =  Math.round(results.cats/sum * 100);
    dogsShare =  Math.round(results.dogs/sum * 100);
	parrotsShare =  Math.round(results.parrots/sum * 100);
	
    $('.cats').css('width', `${catsShare}%`).attr('aria-valuenow', catsShare);
    $('.cats-title').text(`Кошки - ${results.cats} голосов`);
    $('.cats-sum').text(`${catsShare}%`);

    $('.dogs').css('width', `${dogsShare}%`).attr('aria-valuenow', dogsShare);
    $('.dogs-title').text(`Собаки - ${results.dogs} голосов`);
    $('.dogs-sum').text(`${dogsShare}%`);

    $('.parrots').css('width', `${parrotsShare}%`).attr('aria-valuenow', parrotsShare);
    $('.parrots-title').text(`Попугаи - ${results.parrots} голосов`);
    $('.parrots-sum').text(`${parrotsShare}%`);

    $('.summary').text(`${sum}`);
}