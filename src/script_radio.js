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
    voteRes = JSON.parse(message.data)
    console.log(message.data);
    catsVotes =  (voteRes.cats * 100/(voteRes.cats + voteRes.dogs + voteRes.parrots)).toFixed(2);
    dogsVotes =  (voteRes.dogs * 100/(voteRes.cats + voteRes.dogs + voteRes.parrots)).toFixed(2);
	parrotsVotes =  (voteRes.parrots * 100/(voteRes.cats + voteRes.dogs + voteRes.parrots)).toFixed(2);
	
    $('.cats').css('width', `${catsVotes}%`).attr('aria-valuenow', catsVotes);
    $('.cats-title').text(`Кошки - ${voteRes.cats} голосов`);
    $('.cats-sum').text(`${catsVotes}%`);

    $('.dogs').css('width', `${dogsVotes}%`).attr('aria-valuenow', dogsVotes);
    $('.dogs-title').text(`Собаки - ${voteRes.dogs} голосов`);
    $('.dogs-sum').text(`${dogsVotes}%`);

    $('.parrots').css('width', `${parrotsVotes}%`).attr('aria-valuenow', parrotsVotes);
    $('.parrots-title').text(`Попугаи - ${voteRes.parrots} голосов`);
    $('.parrots-sum').text(`${parrotsVotes}%`);
}