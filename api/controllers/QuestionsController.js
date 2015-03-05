/**
 * QuizController
 *
 * Description
 */

module.exports = {

  index: function (req, res) {
    var type      = req.params.type,
        level_num = req.params.level_num;

    // Get appropriate level content from db
    // e.g. http://localhost:1337/tutorials/bitwise/1
    if (type && level_num) {
      // Checks for the tutoral content by checking type and level_num
      Levels
      .findOne({ type: type, level_num: level_num })
      .exec(function (err, level) {
        if (level === undefined) return res.notFound();
        if (err) return res.negotiate(err);

        // Checks for the question data for this level
        Questions
        .find({ level_id: level.level_id })
        .exec(function (err, questions) {
          if (questions === undefined) return res.notFound();
          if (err) return res.negotiate(err);

          var title = "Level " + level_num + " (" + type + ")";

          res.view('quiz', {
            'title': title,
            'tutorial': level,
            'questions': questions
          });
        });
      });
    } else {
      res.notFound();
    }
  }

};
