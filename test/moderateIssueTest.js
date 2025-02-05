var sinon = require("sinon");
var proxyquire =  require('proxyquire')
var issueOpenedPayload = require('./fixtures/issue-opened.json')

describe("ModerateIssue", function() {
  var moderateIssue

  before(function() {
    createCommentStub = sinon.spy()
    addLabelsStub = sinon.spy()
    octoKitStubs = {
      issues: {
        addLabelsStub: addLabelsStub,
        createComment: createCommentStub
      }
    }


    moderateIssue = proxyquire("../ModerateIssue/index", {
      '@octokit/rest': () => octoKitStubs,
      './authenticate': () => true,
      './get-luis-intent': () => 'question'
    });
  });

  it('should create comment when issue is opened', async () => {
    await moderateIssue({}, { body: issueOpenedPayload })

    sinon.assert.calledWith(createCommentStub, {
      body: "Greeting from Bank Mandiri, thank you for submitting the ticket, we will review your issue soon and provide feedback!",
      number: issueOpenedPayload.issue.number,
      owner: issueOpenedPayload.repository.owner.login,
      repo: issueOpenedPayload.repository.name
    });
  })
});
