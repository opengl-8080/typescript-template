describe('suite', function() {
    it('spec', function() {
        
        var sample = new mine.Sample('test');
        
        expect(sample.getName()).toBe('test');
        
    });
});

