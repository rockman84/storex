import Model from "../../store/Model";

/**
 * @property {BigInteger} id
 * @property {String} title
 * @property {BigInteger} status
 * @property {BigInteger} created_at
 */
export default class BlogPost extends Model
{

  static STATUS_PUBLISH = 2;
  static STATUS_DRAFT = 1;

  attributes() {
    return {
      id: null,
      title: null,
      status: BlogPost.STATUS_DRAFT,
      created_at: Date.now(),
    };
  }

  rules() {
    return {
      id: [
        {type: 'required'},
        {type: 'integer'}
      ],
      title: [
        {type: 'default', value: function (model) {
          return 'Default Value function';
        }},
        {type: 'required'},
        {type: 'string', min: 5, max: 80},
        ['customValidation', {foo: 'bar'}],
      ],
      status: [
        {type: 'required'},
        {type: 'integer'},
      ],
      created_at: [
        {type: 'integer'},
      ],
    };
  }

  customValidation(attribute, params)
  {
    if (this.title) {
      this.setError(attribute, 'Custom Error');
    }
  }
}
