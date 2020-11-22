import Model from "../../store/Model";
import AxiosModel from "@/components/storex/store/AxiosModel";

/**
 * @property {BigInteger} id
 * @property {String} title
 * @property {BigInteger} status
 * @property {BigInteger} created_at
 */
export default class BlogPost extends AxiosModel
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
      // id: ['required', 'number'],
      title: [

        'required',
        // 'function',
        // ['customValidation', {foo: 'bar'}],
      ],
      // status: ['number'],
      // created_at: ['number'],
    };
  }

  customValidation(attribute, params)
  {

  }
}
