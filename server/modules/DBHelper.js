/**
 * Created by nnnyy on 2018-11-27.
 */

class DBHelper {
    constructor() {
        this.sql = require('./MySQL');
        this.init();
    }

    init() {
    }

    login(id, pw, ip, cb) {
        try {
            this.sql.query("CALL login(?,?,?, @ret); select @ret;", [id, pw, ip] , function(err, rows) {
                if(err) {
                    console.log('error : ' + err);
                    cb({ret: -99});
                    return;
                }

                var ret = rows[rows.length - 1][0]['@ret'];
                var data = rows[0][0];
                cb({id: data.id, nick: data.nick, auth: data.auth_state, adminMemberVal: data.adminMemberVal, ret: ret});
            });
        }catch(err) {

            cb({ret: -99});
        }
    }

    getRandQuiz(cb) {
        try {
            this.sql.query("select * from quiz where quiz_idx >= 4 order by rand() limit 0,1", function(err, rows) {
                if(err) {
                    console.log('error : ' + err);
                    cb({ret: -99});
                    return;
                }

                var data = [];
                for( var i  = 0; i < rows.length ; ++i ) {
                    var d = rows[i];
                    data.push({idx: d.quiz_idx, question: d.question ,answer: [d.answer1, d.answer2, d.answer3], collect: d.collect_idx});
                }
                cb({ret:0, quizdata: data[0]});
            });
        }catch(err) {

            cb({ret: -99});
        }
    }

    getActivePoint(id, cb) {
        try {
            this.sql.query("CALL getActivePoint( ?, @point ); select @point;", [id], function(err, rows) {
                if(err) {
                    console.log('error : ' + err);
                    cb({ret: -99});
                    return;
                }

                var point = rows[rows.length - 1][0]['@point'];
                cb({ret: 0, point: point});
            });
        }catch(err) {
            //Log.logger.debug('DB Failed - getActivePoint');
            cb({ret: -1});
        }
    }

    getQuizInfo(id, cb) {
        try {
            this.sql.query("CALL getQuizRecord( ?, @maxCombo ); select @maxCombo;", [id], function(err, rows) {
                if(err) {
                    console.log('error : ' + err);
                    cb({ret: -99});
                    return;
                }

                var maxCombo = rows[rows.length - 1][0]['@maxCombo'];
                cb({ret: 0, maxCombo: maxCombo});
            });
        }catch(err) {
            //Log.logger.debug('DB Failed - getActivePoint');
            cb({ret: -1});
        }
    }

    getQuizRecordRank(cb) {
        try {
            this.sql.query("CALL getQuizRecordRank()", function(err, rows) {
                if(err) {
                    console.log('error : ' + err);
                    cb({ret: -99});
                    return;
                }

                const aDataList = rows[0];
                cb({ret: 0, list: aDataList});
            });
        }catch(err) {
            //Log.logger.debug('DB Failed - getActivePoint');
            cb({ret: -1});
        }
    }

    incPoint(id, incPoint, cb) {
        try {
            this.sql.query("CALL incActivePoint( ?, ? );", [id, incPoint], function(err, rows) {
                if(err) {
                    console.log('error : ' + err);
                    cb({ret: -99});
                    return;
                }

                cb({ret: 0});
            });
        }catch(err) {
            //Log.logger.debug('DB Failed - updateActivePoint');
            cb({ret: -1});
        }
    }

    savePoint(id, point, cb) {
        try {
            this.sql.query("CALL updateActivePoint( ?, ? );", [id, point], function(err, rows) {
                if(err) {
                    console.log('error : ' + err);
                    cb({ret: -99});
                    return;
                }

                cb({ret: 0});
            });
        }catch(err) {
            //Log.logger.debug('DB Failed - updateActivePoint');
            cb({ret: -1});
        }
    }

    saveMaxCombo(id, maxCombo, cb) {
        try {
            this.sql.query("CALL updateQuizRecord( ?, ? );", [id, maxCombo], function(err, rows) {
                if(err) {
                    console.log('error : ' + err);
                    cb({ret: -99});
                    return;
                }

                cb({ret: 0});
            });
        }catch(err) {
            //Log.logger.debug('DB Failed - updateActivePoint');
            cb({ret: -1});
        }
    }

    getStatistics(cb) {
        try {
            this.sql.query("CALL getStatistics()", function(err, rows) {
                if(err) {
                    console.log('error : ' + err);
                    if( cb ) cb({ret: -99});
                    return;
                }

                if( cb ) cb({ret: 0, list: rows[0], list2: rows[1], oxrank: rows[2] });
            });
        }catch(err) {
            // Log.logger.debug('DB Failed - getStatistics');
            if( cb ) cb({ret: -1});
        }
    }

    getTodayQuizList( cb ) {
        try {
            this.sql.query("CALL getTodayQuizShow()", function(err, rows) {
                if(err) {
                    console.log('error : ' + err);
                    cb({ret: -99});
                    return;
                }

                cb({ret: 0, tableList: rows[0] });
            });
        }catch(err) {
            console.log(err);
            cb({ret: -1});
        }
    }

    getPermanentBanList( cb ) {
        try {
            this.sql.query("select * from permanentbanlist", function(err, rows) {
                if(err) {
                    console.log(err);

                    cb({ret: -1});
                    return;
                }
                var data = new Map();
                for( var i  = 0; i < rows.length ; ++i ) {
                    var d = rows[i];
                    if( d.ip != '' )
                        data.set(d.ip, 1);
                    if( d.id != '')
                        data.set(d.id, 1);
                }

                cb({ret: 0, list: data});
            });
        }catch(err) {
            //Log.logger.debug('DB Failed - getPermanentBanList');
            cb({ret: -1});
        }
    }

    search( query, cb ) {
        try {
            var queries = query.trim().split(' ');
            var queries_backup = queries;
            var question_query = '';
            var answer1_query = '';
            var answer2_query = '';
            var answer3_query = '';
            for( var i = 0 ; i < queries.length ; ++i ) {
                queries[i] = '%' + queries[i].trim() + '%';
                var t = ('like \'' + queries[i] + '\' ');
                question_query += ('question ' + t);
                answer1_query += ('answer1 ' + t);
                answer2_query += ('answer2 ' + t);
                answer3_query += ('answer3 ' + t);
                if( i != queries.length - 1  ) {
                    question_query += ' or ';
                    answer1_query += ' or ';
                    answer2_query += ' or ';
                    answer3_query += ' or ';
                }
            }

            var where = question_query + ' or ' + answer1_query + ' or ' + answer2_query + ' or ' + answer3_query;
            //console.log(where);

            var final = "select * from quiz where " + where;
            //console.log( final );

            this.sql.query(final, function(err, rows) {
                if(err) {
                    cb({ret: -1});
                    return;
                }
                var data = [];
                for( var i  = 0; i < rows.length ; ++i ) {
                    var d = rows[i];
                    data.push({idx: d.quiz_idx, question: d.question ,answer: [d.answer1, d.answer2, d.answer3], collect: d.collect_idx});
                }
                cb({ret:0, queries: queries_backup, quizdatalist: data});
            });
        }catch(err) {
            //Log.logger.debug('DB Failed - search');
            console.log(err);
            cb({ret: -1});
        }
    }

    updateLevel(id, level, cb) {
        try {
            this.sql.query("CALL updateAuth( ?, ? )", [id, level], function(err, rows) {
                if(err) {
                    console.log('error : ' + err);
                    cb({ret: -99});
                    return;
                }

                cb({ret: 0 });
            });
        }catch(err) {
            //Log.logger.debug('DB Failed - updateAuth');
            cb({ret: -1});
        }
    }

    getRandWord(cb) {
        try {
            this.sql.query("select * from chosunggame order by rand() limit 0,1", function(err, rows) {
                if(err) {
                    console.log('error : ' + err);
                    cb({ret: -99});
                    return;
                }
                
                cb({ret:0, word: rows[0].word, ctype: rows[0].ctype });
            });
        }catch(err) {

            cb({ret: -99});
        }
    }

    getOXQuiz(cb) {
        try {
            this.sql.query("select * from oxquiz order by rand() limit 0,1", function(err, rows) {
                if(err) {
                    console.log('error : ' + err);
                    cb({ret: -99});
                    return;
                }
                
                cb({ret:0, q: rows[0].q, collect: rows[0].collect, desc: rows[0].description });
                //cb({ret: 0, q: '우리나라 인구는 5천만명 미만이다', collect: 2});
            });            
        }catch(err) {

            cb({ret: -99});
        }        
    }

    addOXWinLog(id, usercnt, cb) {
        try {
            this.sql.query("CALL addOxWinLog( ?, ? )", [id, usercnt], function(err, rows) {
                if(err) {
                    console.log('error : ' + err);
                    cb({ret: -99});
                    return;
                }

                cb({ret: 0 });
            });
        }catch(err) {
            //Log.logger.debug('DB Failed - updateAuth');
            cb({ret: -1});
        }        
    }
}


const _obj = new DBHelper();
module.exports = _obj;