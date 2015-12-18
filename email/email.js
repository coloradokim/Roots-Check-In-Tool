var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
  auth: {
    api_user: 'rootschool',
    api_key: 'Ta2AWXj3JlKDWibYqnueQgNXCH7t!'
  }
}

var mailer = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'rootschool',
    pass: 'Ta2AWXj3JlKDWibYqnueQgNXCH7t'
  }
});

var email = {
  //list of teacher emails goes below
    to: ['schlesinger.kim@gmail.com'],
    //from jill?
    from: 'jj.letest@rootselementary.org',
    subject: 'Hi there',
    text: 'Awesome sauce',
    html: '<b>Awesome sauce</b>',
};

mailer.sendMail(email, function(err, res) {
    if (err) {
        console.log(err)
    }
    console.log(res);
});
