import { Router } from 'express';
import Blockchain from '../src/blockchain.mjs';

let blockchain = null;
let blockchainEvent = {};
function selectEvent(event) {
    if (!blockchainEvent[event]) blockchainEvent[event] = new Blockchain();
    return blockchain = blockchainEvent[event];
}

const publicapi = Router();

// api/
publicapi.get('/', (req, res) => res.json({ error: false }));

// api/get_chain
publicapi.get('/get_chain', (req, res) => {

    const { event } = req.body;
    if (!event) return res.status(500).json({ error: true, msg: 'not found event' });
    selectEvent(event);

    return res.json({
        "chain": blockchain.chain,
        "length": blockchain.chain.length
    });

});

// api/mining
publicapi.post('/mining', (req, res) => {

    const { event, ...data } = req.body;
    if (!event) return res.status(500).json({ error: true, msg: 'not found event' });
    selectEvent(event);

    let previous_block = blockchain.get_pervious_block();
    let previous_nonce = previous_block['nonce'];
    let nonce = blockchain.proof_of_work(previous_nonce);
    let previous_hash = previous_block.hash;
    blockchain.create_block(nonce, previous_hash, data);
    return res.json({ error: false });
});

// api/check_chain
publicapi.get('/check_chain', (req, res) => {

    const { event } = req.body;
    if (!event) return res.status(500).json({ error: true, msg: 'not found event' });
    selectEvent(event);

    let check = blockchain.is_chain_valid(blockchain.chain);
    return res.json({ message: check ? 'BlockChain Vaild' : 'BlockChain have problem' });
});

export default publicapi;