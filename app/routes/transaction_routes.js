// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for transactions
const Transaction = require('../models/transaction')

// we'll use this to intercept any errors that get thrown and send them
// back to the client with the appropriate status code
const handle = require('../../lib/error_handler')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /transactions
router.get('/transactions', (req, res) => {
  Transaction.find()
    .then(transactions => {
      // `transactions` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return transactions.map(transaction => transaction.toObject())
    })
    // respond with status 200 and JSON of the transactions
    .then(transactions => res.status(200).json({ transactions: transactions }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// SHOW
// GET /transactions/5a7db6c74d55bc51bdf39793
router.get('/transactions/:id', (req, res) => {
  // req.params.id will be set based on the `:id` in the route
  Transaction.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "transaction" JSON
    .then(transaction => res.status(200).json({ transaction: transaction.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// CREATE
// POST /transactions
router.post('/transactions', requireToken, (req, res) => {
  // set owner of new transaction to be current user
  req.body.transaction.owner = req.user.id

  Transaction.create(req.body.transaction)
    // respond to succesful `create` with status 201 and JSON of new "transaction"
    .then(transaction => {
      res.status(201).json({ transaction: transaction.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(err => handle(err, res))
})

// UPDATE
// PATCH /transactions/5a7db6c74d55bc51bdf39793
router.patch('/transactions/:id', requireToken, (req, res) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.transaction.owner

  Transaction.findById(req.params.id)
    .then(handle404)
    .then(transaction => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, transaction)

      // the client will often send empty strings for parameters that it does
      // not want to update. We delete any key/value pair where the value is
      // an empty string before updating
      Object.keys(req.body.transaction).forEach(key => {
        if (req.body.transaction[key] === '') {
          delete req.body.transaction[key]
        }
      })

      // pass the result of Mongoose's `.update` to the next `.then`
      return transaction.update(req.body.transaction)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// DESTROY
// DELETE /transactions/5a7db6c74d55bc51bdf39793
router.delete('/transactions/:id', requireToken, (req, res) => {
  Transaction.findById(req.params.id)
    .then(handle404)
    .then(transaction => {
      // throw an error if current user doesn't own `transaction`
      requireOwnership(req, transaction)
      // delete the transaction ONLY IF the above didn't throw
      transaction.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

module.exports = router
