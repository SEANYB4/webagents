class RLAgent {


    constructor(actions, alpha = 0.05, gamma = 0.95) {



        this.qTable = {};
        this.alpha = alpha;
        this.gamma = gamma;
        this.actions = actions;

    }


    getQ(state, action) {
        return this.qTable[state] ? (this.qTable[state][action] || 0) : 0;
    }


    setQ(state, action, value) {

        if (!this.qTable[state]) {
            this.qTable[state] = {};
        }
        this.qTable[state][action] = value;
    }


    chooseAction(state) {


        // Epsilion-greedy policy can be implemented here
        const qValues = this.actions.map(action => this.getQ(state, action));

        const maxQ = Math.max(...qValues);
        const actionChoices = this.actions.filter((action, i) => qValues[i] === maxQ);
        return actionChoices[Math.floor(Math.random() * actionChoices.length)];
    }

    updateQ(state, action, reward, nextState) {

        const currentQ = this.getQ(state, action);
        const maxQNext = Math.max(...this.actions.map(a => this.getQ(nextState, a)));

        const newQ = currentQ + this.alpha * (reward + this.gamma * maxQNext - currentQ);
        this.setQ(state, action, newQ);


    }

    stateToString(dx, dy) {

        return `${dx}:${dy}`;
    }
}


// export { RLAgent };