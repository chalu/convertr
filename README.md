## About 
A currency converter capstone project for [#ALCwithGoogle](https://twitter.com/hashtag/ALCwithGoogle?src=hash) and the rest of the world :D

Live App is Here =>  https://chalu.github.io/convertr/

## How It Works
* Go to https://chalu.github.io/convertr/ in your browser
* Add the app to your Home Screen. Why not?
* The next time you visit the app URL, or launch it from your home screen, you will be all setup for `reliable` currency conversions. (TODO - improve ServiceWorker and cliam app after registration)
* To make a conversion, type a query into the text field using this format
```
amount? source currency to | in | > target curency [, target currenct]*
```

## Sample Usage Queries 
* 1 United States Dollar to South African Rand : `USD to ZAR`
* 10 United States Dollars to Nigerian Naira : `10 USD in NGN`
* 50 United States Dollars to Nigerian Naira, Kenyan Shillings and Ghanian Cedi: `50 USD > NGN, KES, GHS`


## Features
* Uses the free version of `https://free.currencyconverterapi.com` API to convert between currencies
* Though free usage of the API has a limit of 2 conversions per API call (e.g USD -> NGN and USD to ZAR), this app allows you do more conversions at a go
* Works offline with a smart ServiceWorker :D
* Conversions occur once per day, thus subsequent conversion for USD -> ZAR after then first one will return same result for that day. (TODO - make this configurable)
* Simple querying. `USD to ZAR, KES, NGN, PHP` will convert all from 1 United States Dollar to all the currencies appearing after `to`. You can also use `in` or `>` in place of `to`
* Smart and optimized querying. Within the same day or anytime before, if you have converted `USD to KES, NGN` and then now request `USD to ZAR, KES, NGN, PHP`, the `USD -> KES` and `USD -> NGN` in this new request will be loaded from cache
* Even if offline, the user will at least see results of previous conversions intead of an offline dinosour, a blank screen, or a less useful message saying there's no connection :D
* All conversion requests made when offline are queue-ed into an `OUTBOX`. (TODO - will use BackgroundSync to complete such requests and then notify the user)

## Feedback
Feel very free to reach me on Twitter with [@chaluwa](https://twitter.com/chaluwa) or start and fork the repo. 

I really want to hear from you. I am open to ideas, suggestions and general feedback on this implementation of a currency converter and my usage of ServiceWorker in the app.

And yes, PRs are welcome!

