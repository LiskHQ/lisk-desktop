import './vote.less';

app.component('vote', {
  template: require('./vote.pug')(),
  bindings: {
    account: '=',
    passphrase: '<',
    voteList: '=',
    unvoteList: '=',
  },
  controller: class vote {
    constructor($scope, $mdDialog, $mdToast, $peers) {
      this.$mdDialog = $mdDialog;
      this.$mdToast = $mdToast;
      this.$peers = $peers;
    }

          // eslint-disable-next-line class-methods-use-this
    removeVote(list, index) {
            /* eslint-disable no-param-reassign */
      list[index].status.selected = list[index].status.voted;
      list[index].status.changed = false;
            /* eslint-enable no-param-reassign */
      list.splice(index, 1);
    }

    canVote() {
      const totalVotes = this.voteList.length + this.unvoteList.length;
      return totalVotes > 0 && totalVotes <= 33 &&
              !this.votingInProgress &&
              (!this.account.secondSignature || this.secondPassphrase);
    }

    vote() {
      this.votingInProgress = true;
      this.$peers.active.sendRequest('accounts/delegates', {
        secret: this.passphrase,
        publicKey: this.account.publicKey,
        secondSecret: this.secondPassphrase,
        delegates: this.voteList.map(delegate => `+${delegate.publicKey}`).concat(
                  this.unvoteList.map(delegate => `-${delegate.publicKey}`)),
      },
              (response) => {
                const toast = this.$mdToast.simple();
                if (response.success) {
                  this.clearVotes();
                  this.$mdDialog.hide();
                  toast.toastClass('lsk-toast-success');
                  toast.textContent('Voting succesfull');
                } else {
                  toast.toastClass('lsk-toast-error');
                  toast.textContent(response.message || 'Voting failed');
                }
                this.$mdToast.show(toast);
                this.votingInProgress = false;
              });
    }

    clearVotes() {
      this.voteList.forEach((delegate) => {
              /* eslint-disable no-param-reassign */
        delegate.status.changed = false;
        delegate.status.voted = true;
      });
      this.voteList.splice(0, this.voteList.length);

      this.unvoteList.forEach((delegate) => {
        delegate.status.changed = false;
        delegate.status.voted = false;
              /* eslint-enable no-param-reassign */
      });
      this.unvoteList.splice(0, this.voteList.length);
    }

    close() {
      this.$mdDialog.hide();
    }
        },
});

