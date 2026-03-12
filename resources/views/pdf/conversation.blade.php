<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<style>

body{
    font-family: DejaVu Sans;
    font-size:8px;
    line-height:1.2;
}

/* conteneur colonnes */
.columns{
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.message{
    flex: 0 0 calc(33.333% - 15px); /* 3 colonnes avec gap */
    break-inside:avoid;
    margin-bottom:6px;
}

/* bulles */
.bubble{
    padding:4px 6px;
    border-radius:6px;
    max-width:90%;
}

/* message moi */
.me{
    text-align:right;
}

.me .bubble{
    background:#d6f4ff;
    display:inline-block;
}

/* message autre */
.other{
    text-align:left;
}

.other .bubble{
    background:#eeeeee;
    display:inline-block;
}

/* nom */
.sender{
    font-weight:bold;
}

/* heure */
.time{
    font-size:7px;
    color:#666;
}

</style>
</head>

<body>

<h3>Conversation #{{ $conversation->id }}</h3>

<div class="columns">

@foreach($messages as $message)

<div class="message {{ $message->sender_id === auth()->id() ? 'me' : 'other' }}">

    <div class="bubble">

        <div class="sender">
            {{ $message->sender->name }}
        </div>

        <div>
            {{ $message->content }}
        </div>

        <div class="time">
            {{ $message->created_at }}
        </div>

    </div>

</div>

@endforeach

</div>

</body>
</html>