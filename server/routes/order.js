const router = require('express').Router();

const OrderController = require('../controllers/orderController');
const { checkAuth, checkAuthAndAuthorization } = require('../middlewares/auth');
const { checkStatusOrder } = require('../middlewares/order');

router.get('/history', OrderController.returnOrders);

router.get('/confirm/:id/:token', OrderController.confirmCart);

router.post('/confirm', checkAuth, OrderController.confirm); //para confirmar el carrito

router.post('/add', OrderController.createOrder);

module.exports = router;
