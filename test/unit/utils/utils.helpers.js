var assert = require('assert'),
    _ = require('lodash'),
    utils = require('../../../lib/waterline/utils/helpers');

describe('utils/helpers', function() {

  describe('.mergeCriteria()', function(){
    var criteria, defaultCriteria;

    beforeEach(function(){
      criteria = {
        where: {
          id: 123,
          firstName: 'John'
        }
      };
      defaultCriteria = {
        deletedAt: null
      };
    });

    it('should return false if criteria is false', function(){
      criteria.where = false;
      utils.mergeCriteria(criteria,defaultCriteria);
      assert(_.isEqual(criteria,{
        where: false
      }));
    });

    it('should return criteria unmodified if no default is set', function(){
      var defaultCriteria;
      utils.mergeCriteria(criteria,defaultCriteria);
      assert(_.isEqual(criteria,{
        where: {
          id: 123,
          firstName: 'John'
        }
      }));
    });

    it('should use default if no criteria.where is set', function(){
      delete criteria.where;
      utils.mergeCriteria(criteria,defaultCriteria);
      assert(_.isEqual(criteria,{
        where: {
          deletedAt: null
        }
      }));
    });

    it('should apply defaults to every OR options in criteria, if used', function(){
      criteria.where.or = [
        { lastName: 'Doe' },
        { lastName: 'Smith' }
      ];
      utils.mergeCriteria(criteria,defaultCriteria);
      assert(_.isEqual(criteria,{
        where: {
          id: 123,
          firstName: 'John',
          or: [
            {
              lastName: 'Doe',
              deletedAt: null
            },
            {
              lastName: 'Smith',
              deletedAt: null
            }
          ]
        }
      }));
    });

    it('should not override a OR option with the same key', function(){
      criteria.where.or = [
        {
          lastName: 'Doe',
          deletedAt: '2017-01-24T08:25:59Z'
        },
        { lastName: 'Smith' }
      ];
      utils.mergeCriteria(criteria,defaultCriteria);
      assert(_.isEqual(criteria,{
        where: {
          id: 123,
          firstName: 'John',
          or: [
            {
              lastName: 'Doe',
              deletedAt: '2017-01-24T08:25:59Z'
            },
            {
              lastName: 'Smith',
              deletedAt: null
            }
          ]
        }
      }));
    });

    it('should append default to criteria if no OR exists', function(){
      utils.mergeCriteria(criteria,defaultCriteria);
      assert(_.isEqual(criteria,{
        where: {
          id: 123,
          firstName: 'John',
          deletedAt: null
        }
      }));
    });

    it('should use criteria value instead of default if both have the same key', function(){
      criteria.where.deletedAt = '2017-01-24T08:25:59Z';
      utils.mergeCriteria(criteria,defaultCriteria);
      assert(_.isEqual(criteria,{
        where: {
          id: 123,
          firstName: 'John',
          deletedAt: '2017-01-24T08:25:59Z'
        }
      }));
    });


  });

});