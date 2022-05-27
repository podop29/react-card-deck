import {useState, useEffect, useRef} from "react"
import axios from "axios"
import Card from "./card"

function TimedDeck() {

    const [deck, setDeck] = useState({
        deck_id: null,
        remaining: 1
    })
    const [cards, setCards] = useState([])

    const [autoDraw, setAutoDraw] = useState(false)


    //Sets deck on first render
    useEffect(()=>{
        async function getDeck(){
            const deck = await axios.get(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
            const tempDeck={
                deck_id: deck.data.deck_id,
                remaining: deck.data.remaining
            }
            setDeck(tempDeck) 
        }
        getDeck()
    },[])



        useEffect(()=>{
            
            
            const intId = setInterval(()=>{
                if(autoDraw){
                    const getCard = async () => {
                        const card =  await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`) 
                        const tempCard = {
                        id:card.data.cards[0].code,
                        image:card.data.cards[0].image
                        }
            
                    const tempCards = [...cards, tempCard]
                    setCards(tempCards)
                    }
                    getCard()
                }
               
            }, 1000) 
            
            return () =>{
                console.log(intId)
                console.log(cards)
                clearInterval(intId)
            }
    
        }, [autoDraw,setAutoDraw])
 

    //Handles button click
    const onSubmit = evt =>{
        evt.preventDefault()
        autoDraw ? setAutoDraw(false) : setAutoDraw(true)
        deck.remaining = deck.remaining-1
    }

  return (
    <>
        
        {deck.remaining !== 0 ? <button onClick={onSubmit}>AutoDraw!</button> : <h1>Out of cards!</h1>}
        <div>
            {cards.map(card=>{return(
                <Card key={card.id} img={card.image}/>
                
            )})}
        </div>

    
    </>
  );
}

export default TimedDeck;
