import './vote.less';

app.component('vote', {
  template: require('./vote.pug')(),
  bindings: {
    // account: '=',
    // passphrase: '<',
    voteList: '=',
    unvoteList: '=',
  },
  controller: class vote {
    constructor($scope, $mdDialog, $mdToast, $peers, $rootScope, Account) {
      this.$mdDialog = $mdDialog;
      this.$mdToast = $mdToast;
      this.$peers = $peers;
      this.$rootScope = $rootScope;
      this.account = Account;
    }

    vote() {
      this.votingInProgress = true;
      this.$peers.sendRequestPromise('accounts/delegates', {
        secret: this.account.get().passphrase,
        publicKey: this.account.get().publicKey,
        secondSecret: this.secondPassphrase,
        delegates: this.voteList.map(delegate => `+${delegate.publicKey}`).concat(
                    this.unvoteList.map(delegate => `-${delegate.publicKey}`)),
      }).then(() => {
        this.$mdDialog.hide(this.voteList, this.unvoteList);
        const toast = this.$mdToast.simple();
        toast.toastClass('lsk-toast-success');
        toast.textContent('Voting succesfull');
        this.$mdToast.show(toast);
      }).catch((response) => {
        const toast = this.$mdToast.simple();
        toast.toastClass('lsk-toast-error');
        toast.textContent(response.message || 'Voting failed');
        this.$mdToast.show(toast);
      }).finally(() => {
        this.votingInProgress = false;
      });
    }

    canVote() {
      const totalVotes = this.voteList.length + this.unvoteList.length;
      return totalVotes > 0 && totalVotes <= 33 &&
              !this.votingInProgress &&
              (!this.account.get().secondSignature || this.secondPassphrase);
    }

    // eslint-disable-next-line class-methods-use-this
    removeVote(list, index) {
      /* eslint-disable no-param-reassign */
      list[index].status.selected = list[index].status.voted;
      list[index].status.changed = false;
      /* eslint-enable no-param-reassign */
      list.splice(index, 1);
    }
  },
});

