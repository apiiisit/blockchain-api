import { Router } from 'express';
import Blockchain from '../src/blockchain.mjs';
const blockchain = new Blockchain();

const publicapi = Router();

publicapi.get('/', (req, res) => res.json({ error: false }));

publicapi.get('/get_chain', (req, res) => {
    return res.json({
        "chain": blockchain.chain,
        "length": blockchain.chain.length
    });
});

publicapi.post('/mining', (req, res) => {

    let data = req.body;

    let previous_block = blockchain.get_pervious_block();
    let previous_nonce = previous_block['nonce'];
    let nonce = blockchain.proof_of_work(previous_nonce);
    let previous_hash = previous_block.hash;
    blockchain.create_block(nonce, previous_hash, data);
    return res.json({});
});

publicapi.get('/check_chain', (req, res) => {
    let check = blockchain.is_chain_valid(blockchain.chain);
    return res.json({ message: check ? 'BlockChain Vaild' : 'BlockChain have problem' });
});




export default publicapi;