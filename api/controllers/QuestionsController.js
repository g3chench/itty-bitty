/**
 * QuestionController
 *
 * Description
 */

module.exports = {

  index: function (req, res) {
    var type      = req.params.type,
        level_num = req.params.level_num;

    // Get appropriate level content from database
    if (type && level_num) {
      // Checks for the tutoral content by checking type and level_num
      Levels
      .findOne()
      .where({ type: type, level_num: level_num })
      .exec(function (err, level) {
        if (level === undefined) return res.notFound();
        if (err) return res.negotiate(err);

        // Checks for the question data for this level
        Questions
        .find()
        .where({ level_id: level.level_id })
        .exec(function (err, questions) {
          if (questions === undefined) return res.notFound();
          if (err) return res.negotiate(err);

          var title = 'Level ' + level_num + ' (' + type + ')';

          res.view('quiz', {
            'title': title,
            'tutorial': level,
            'level_num': level_num,
            'type': type,
            'questions': questions
          });
        });
      });
    } else {
      return res.notFound();
    }
  },

  validateAnswer: function (req, res) {
    var user_sol = req.param('user_solution'),
        questionID = req.param('question_id');

    if (user_sol && questionID) {
      Questions
      .find()
      .where({ question_id: questionID })
      .exec(function (err, questions) {
        if (questions === undefined) return res.notFound();
        if (err) return res.negotiate(err);

        if (questions[0].answer === user_sol) {
          res.send('true');
        } else{
          res.send('false');
        }
      });
    }
  },

  showAnswer: function (req, res) {
    var questionID = req.param('question_id');

    if (questionID) {
      Questions
      .find()
      .where({ question_id: questionID })
      .exec(function (err, questions) {
        if (questions === undefined) return res.notFound();
        if (err) return res.negotiate(err);

        if (questions[0].answer) {
          var explanation = 'Explanation: ' + questions[0].explanation + '\nAnswer: ' + questions[0].answer;
          res.send(explanation);
        }
        else {
          res.send('false');
        }
      });
    }
  }

};




